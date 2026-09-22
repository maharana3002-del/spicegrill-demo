const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyAdminToken } = require('../middleware/auth');

router.post('/', orderController.createOrder);
router.get('/', verifyAdminToken, orderController.getOrders);
router.patch('/:id/status', verifyAdminToken, orderController.updateOrderStatus);

module.exports = router;
