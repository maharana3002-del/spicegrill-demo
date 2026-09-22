const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const { verifyAdminToken } = require('../middleware/auth');

router.get('/', verifyAdminToken, statsController.getDashboardStats);

module.exports = router;
