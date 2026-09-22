const db = require('../config/db');

exports.getDashboardStats = (req, res, next) => {
  try {
    const totalOrders = db.prepare('SELECT COUNT(*) as count FROM orders').get().count;
    const totalRevenue = db.prepare("SELECT COALESCE(SUM(grand_total), 0) as total FROM orders WHERE status != 'cancelled'").get().total;
    const todayOrders = db.prepare("SELECT COUNT(*) as count, COALESCE(SUM(grand_total), 0) as revenue FROM orders WHERE DATE(created_at) = DATE('now') AND status != 'cancelled'").get();
    const pendingOrders = db.prepare("SELECT COUNT(*) as count FROM orders WHERE status = 'pending'").get().count;
    const pendingReservations = db.prepare("SELECT COUNT(*) as count FROM reservations WHERE status = 'pending'").get().count;
    const totalMenuItems = db.prepare('SELECT COUNT(*) as count FROM menu_items').get().count;

    const recentOrders = db.prepare('SELECT * FROM orders ORDER BY id DESC LIMIT 5').all();

    res.json({
      success: true,
      stats: {
        totalOrders,
        totalRevenue,
        todayOrdersCount: todayOrders.count,
        todayRevenue: todayOrders.revenue,
        pendingOrders,
        pendingReservations,
        totalMenuItems
      },
      recentOrders
    });
  } catch (err) {
    next(err);
  }
};
