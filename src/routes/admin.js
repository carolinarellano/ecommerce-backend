const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

router.get('/', adminController.renderAdmin);
router.post('/add', adminController.addProduct);
router.get('/delete/:id', adminController.deleteProduct);
router.get('/edit/:id', adminController.editProductForm);
router.post('/edit/:id', adminController.updateProduct);

module.exports = router;
