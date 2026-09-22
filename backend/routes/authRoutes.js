const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyAdminToken } = require('../middleware/auth');

router.post('/login', authController.login);
router.get('/me', verifyAdminToken, authController.getMe);

module.exports = router;
