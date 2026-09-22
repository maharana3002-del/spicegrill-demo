const db = require('../config/db');

exports.createReservation = (req, res, next) => {
  try {
    const { customer_name, customer_phone, reservation_date, reservation_time, guests_count, seating_type, special_requests } = req.body;

    const stmt = db.prepare(`
      INSERT INTO reservations (customer_name, customer_phone, reservation_date, reservation_time, guests_count, seating_type, special_requests, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')
    `);

    const result = stmt.run(
      customer_name || 'Sample Guest',
      customer_phone || '+1 (555) 010-2026',
      reservation_date || '2026-10-15',
      reservation_time || '19:00',
      guests_count || '2-4 Persons',
      seating_type || 'Private Dining Booth',
      special_requests || 'Simulated concept reservation'
    );

    const reservation = db.prepare('SELECT * FROM reservations WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, message: 'Simulated reservation recorded', is_demo: true, data: reservation });
  } catch (err) {
    next(err);
  }
};

exports.getReservations = (req, res, next) => {
  try {
    const { status } = req.query;
    let query = 'SELECT * FROM reservations';
    const params = [];

    if (status && status !== 'all') {
      query += ' WHERE status = ?';
      params.push(status);
    }

    query += ' ORDER BY id DESC LIMIT 50';
    const reservations = db.prepare(query).all(...params);
    res.json({ success: true, count: reservations.length, data: reservations });
  } catch (err) {
    next(err);
  }
};

exports.updateReservationStatus = (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const valid = ['pending', 'confirmed', 'rejected', 'completed'];

    if (!valid.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid reservation status' });
    }

    db.prepare('UPDATE reservations SET status = ? WHERE id = ?').run(status, id);
    const updated = db.prepare('SELECT * FROM reservations WHERE id = ?').get(id);
    res.json({ success: true, data: updated, message: `Simulated reservation updated to ${status}` });
  } catch (err) {
    next(err);
  }
};
