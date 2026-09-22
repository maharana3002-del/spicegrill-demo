const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { verifyAdminToken } = require('../middleware/auth');

router.get('/', menuController.getMenu);
router.get('/all', verifyAdminToken, menuController.getAllMenuItems);
router.post('/', verifyAdminToken, menuController.createMenuItem);
router.put('/:id', verifyAdminToken, menuController.updateMenuItem);
router.patch('/:id/toggle', verifyAdminToken, menuController.toggleAvailability);
router.delete('/:id', verifyAdminToken, menuController.deleteMenuItem);

module.exports = router;
