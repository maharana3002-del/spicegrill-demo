const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyAdminToken } = require('../middleware/auth');

router.get('/', categoryController.getCategories);
router.post('/', verifyAdminToken, categoryController.createCategory);
router.put('/:id', verifyAdminToken, categoryController.updateCategory);
router.delete('/:id', verifyAdminToken, categoryController.deleteCategory);

module.exports = router;
