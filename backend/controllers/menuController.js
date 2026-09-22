const db = require('../config/db');

exports.getMenu = (req, res, next) => {
  try {
    const { category } = req.query;
    let query = `
      SELECT m.*, c.name as category_name, c.slug as category_slug
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.is_available = 1
    `;
    const params = [];

    if (category && category !== 'all') {
      query += ' AND c.slug = ?';
      params.push(category);
    }

    query += ' ORDER BY m.is_featured DESC, m.id ASC';
    const items = db.prepare(query).all(...params);
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

exports.getAllMenuItems = (req, res, next) => {
  try {
    const items = db.prepare(`
      SELECT m.*, c.name as category_name, c.slug as category_slug
      FROM menu_items m
      LEFT JOIN categories c ON m.category_id = c.id
      ORDER BY m.id DESC
    `).all();
    res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    next(err);
  }
};

exports.createMenuItem = (req, res, next) => {
  try {
    const { category_id, name, price, description, image_url, badge, is_featured, is_available } = req.body;
    if (!name || price === undefined) {
      return res.status(400).json({ success: false, message: 'Name and price are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO menu_items (category_id, name, price, description, image_url, badge, is_featured, is_available)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      category_id || null,
      name,
      price,
      description || '',
      image_url || 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=600&q=80',
      badge || '',
      is_featured ? 1 : 0,
      is_available !== undefined ? (is_available ? 1 : 0) : 1
    );

    const newItem = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, data: newItem });
  } catch (err) {
    next(err);
  }
};

exports.updateMenuItem = (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_id, name, price, description, image_url, badge, is_featured, is_available } = req.body;

    const stmt = db.prepare(`
      UPDATE menu_items SET
        category_id = COALESCE(?, category_id),
        name = COALESCE(?, name),
        price = COALESCE(?, price),
        description = COALESCE(?, description),
        image_url = COALESCE(?, image_url),
        badge = COALESCE(?, badge),
        is_featured = COALESCE(?, is_featured),
        is_available = COALESCE(?, is_available)
      WHERE id = ?
    `);

    stmt.run(
      category_id,
      name,
      price,
      description,
      image_url,
      badge,
      is_featured !== undefined ? (is_featured ? 1 : 0) : null,
      is_available !== undefined ? (is_available ? 1 : 0) : null,
      id
    );

    const updated = db.prepare('SELECT * FROM menu_items WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.toggleAvailability = (req, res, next) => {
  try {
    const { id } = req.params;
    const item = db.prepare('SELECT is_available FROM menu_items WHERE id = ?').get(id);
    if (!item) return res.status(404).json({ success: false, message: 'Item not found' });

    const newStatus = item.is_available ? 0 : 1;
    db.prepare('UPDATE menu_items SET is_available = ? WHERE id = ?').run(newStatus, id);
    res.json({ success: true, is_available: newStatus, message: `Item is now ${newStatus ? 'In Stock' : 'Out of Stock'}` });
  } catch (err) {
    next(err);
  }
};

exports.deleteMenuItem = (req, res, next) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);
    res.json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    next(err);
  }
};
