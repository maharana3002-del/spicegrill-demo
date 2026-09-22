const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const categoryRoutes = require('./categoryRoutes');
const menuRoutes = require('./menuRoutes');
const orderRoutes = require('./orderRoutes');
const reservationRoutes = require('./reservationRoutes');
const statsRoutes = require('./statsRoutes');

router.use('/admin', authRoutes);
router.use('/categories', categoryRoutes);
router.use('/menu', menuRoutes);
router.use('/orders', orderRoutes);
router.use('/reservations', reservationRoutes);
router.use('/stats', statsRoutes);

// Health check endpoint with clear demo disclaimer
router.get('/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'Spice Grill — Restaurant Website Concept Demo',
    disclaimer: 'Unofficial Demo Website — Not affiliated with or endorsed by any real restaurant.',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
