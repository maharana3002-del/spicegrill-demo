const express = require('express');
const router = express.Router();
const reservationController = require('../controllers/reservationController');
const { verifyAdminToken } = require('../middleware/auth');

router.post('/', reservationController.createReservation);
router.get('/', verifyAdminToken, reservationController.getReservations);
router.patch('/:id/status', verifyAdminToken, reservationController.updateReservationStatus);

module.exports = router;
