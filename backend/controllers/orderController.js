const db = require('../config/db');

// Place simulated demo order
exports.createOrder = (req, res, next) => {
  try {
    const { customer_name, customer_phone, delivery_address, order_type, items, notes } = req.body;

    const name = customer_name || 'Demo Guest';
    const phone = customer_phone || '+1 (555) 010-2026';
    const type = order_type === 'takeaway' ? 'takeaway' : 'delivery';
    const deliveryFee = type === 'delivery' ? 2.50 : 0;

    let subtotal = 0;
    const sanitizedItems = (items && Array.isArray(items) && items.length > 0) ? items.map(item => {
      const price = parseFloat(item.price) || 10.00;
      const qty = parseInt(item.qty || item.quantity) || 1;
      const itemSub = price * qty;
      subtotal += itemSub;
      return {
        menu_item_id: item.id || null,
        item_name: item.name || 'Sample Menu Item',
        unit_price: price,
        quantity: qty,
        subtotal: itemSub
      };
    }) : [
      {
        menu_item_id: 1,
        item_name: 'Sample Culinary Dish',
        unit_price: 18.99,
        quantity: 1,
        subtotal: 18.99
      }
    ];

    if (subtotal === 0) subtotal = 18.99;
    const grandTotal = subtotal + deliveryFee;
    const orderNumber = 'SG-DEMO-' + Math.floor(100 + Math.random() * 900);

    const placeOrderTransaction = db.transaction(() => {
      const orderStmt = db.prepare(`
        INSERT INTO orders (order_number, customer_name, customer_phone, delivery_address, order_type, subtotal, delivery_fee, grand_total, status, notes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)
      `);

      const orderResult = orderStmt.run(
        orderNumber,
        name,
        phone,
        delivery_address || '123 Demo Avenue, Food District, USA',
        type,
        subtotal,
        deliveryFee,
        grandTotal,
        notes || 'Simulated demo order'
      );

      const orderId = orderResult.lastInsertRowid;

      const itemStmt = db.prepare(`
        INSERT INTO order_items (order_id, menu_item_id, item_name, unit_price, quantity, subtotal)
        VALUES (?, ?, ?, ?, ?, ?)
      `);

      sanitizedItems.forEach(i => {
        itemStmt.run(orderId, i.menu_item_id, i.item_name, i.unit_price, i.quantity, i.subtotal);
      });

      return orderId;
    });

    const newOrderId = placeOrderTransaction();
    const fullOrder = db.prepare('SELECT * FROM orders WHERE id = ?').get(newOrderId);
    const orderItems = db.prepare('SELECT * FROM order_items WHERE order_id = ?').all(newOrderId);

    res.status(201).json({
      success: true,
      message: 'Simulated demo order recorded successfully',
      is_demo: true,
      data: {
        ...fullOrder,
        items: orderItems
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = (req, res, next) => {
  try {
    const { status, limit = 50 } = req.query;
    let query = 'SELECT * FROM orders';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY id DESC LIMIT ?';
    params.push(parseInt(limit));

    const orders = db.prepare(query).all(...params);
    const getItemsStmt = db.prepare('SELECT * FROM order_items WHERE order_id = ?');
    
    const enrichedOrders = orders.map(order => ({
      ...order,
      items: getItemsStmt.all(order.id)
    }));

    res.json({ success: true, count: enrichedOrders.length, data: enrichedOrders });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status value' });
    }

    db.prepare('UPDATE orders SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM orders WHERE id = ?').get(id);

    res.json({ success: true, data: updated, message: `Simulated order status updated to ${status}` });
  } catch (err) {
    next(err);
  }
};
