const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.login = (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const admin = db.prepare('SELECT * FROM admins WHERE username = ?').get(username);
    if (!admin) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const isMatch = bcrypt.compareSync(password, admin.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid username or password' });
    }

    const token = jwt.sign(
      { id: admin.id, username: admin.username, name: admin.name },
      process.env.JWT_SECRET || 'spice_grill_concept_demo_secret_2026',
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: { id: admin.id, username: admin.username, name: admin.name }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = (req, res, next) => {
  try {
    const admin = db.prepare('SELECT id, username, name, created_at FROM admins WHERE id = ?').get(req.admin.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found' });
    }
    res.json({ success: true, admin });
  } catch (err) {
    next(err);
  }
};
