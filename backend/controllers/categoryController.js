const db = require('../config/db');

exports.getCategories = (req, res, next) => {
  try {
    const categories = db.prepare('SELECT * FROM categories ORDER BY sort_order ASC').all();
    res.json({ success: true, count: categories.length, data: categories });
  } catch (err) {
    next(err);
  }
};

exports.createCategory = (req, res, next) => {
  try {
    const { name, slug, icon, sort_order } = req.body;
    if (!name || !slug) {
      return res.status(400).json({ success: false, message: 'Name and slug are required' });
    }
    const stmt = db.prepare('INSERT INTO categories (name, slug, icon, sort_order) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, slug, icon || 'utensils', sort_order || 0);
    const newCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(info.lastInsertRowid);
    res.status(201).json({ success: true, data: newCategory });
  } catch (err) {
    next(err);
  }
};

exports.updateCategory = (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, slug, icon, sort_order } = req.body;
    const stmt = db.prepare(`
      UPDATE categories SET 
        name = COALESCE(?, name),
        slug = COALESCE(?, slug),
        icon = COALESCE(?, icon),
        sort_order = COALESCE(?, sort_order)
      WHERE id = ?
    `);
    stmt.run(name, slug, icon, sort_order, id);
    const updated = db.prepare('SELECT * FROM categories WHERE id = ?').get(id);
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteCategory = (req, res, next) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};
