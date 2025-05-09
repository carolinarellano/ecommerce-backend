const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { body } = require('express-validator');

// Crear producto
router.post('/', [
  body('title').notEmpty().withMessage('El título es obligatorio'),
  body('pricePerUnit').isNumeric().withMessage('El precio debe ser numérico'),
  body('stock').isNumeric().withMessage('El stock debe ser numérico')
], productController.createProduct);

// Actualizar producto
router.put('/:uuid', [
  body('title').optional().notEmpty(),
  body('pricePerUnit').optional().isNumeric(),
  body('stock').optional().isNumeric()
], productController.updateProduct);

// Obtener todos los productos
router.get('/', productController.getAllProducts);

// Obtener producto por uuid
router.get('/:uuid', productController.getProductByUUID);

// Eliminar producto
router.delete('/:uuid', productController.deleteProduct);

module.exports = router;
