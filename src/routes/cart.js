const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
// const { verifyToken } = require('../middlewares/auth');
const { check } = require('express-validator');

// router.use(verifyToken); // Verificar token para todas las rutas del carrito

// Obtener carrito del usuario
router.get('/', cartController.getCart);

// Agregar producto al carrito
router.post('/', [
  check('product_id', 'El ID del producto es requerido').isInt(),
  check('quantity', 'La cantidad debe ser al menos 1').isInt({ min: 1 })
], cartController.addToCart);

// Actualizar cantidad en el carrito
router.put('/:id', [
  check('quantity', 'La cantidad debe ser al menos 1').isInt({ min: 1 })
], cartController.updateCartItem);

// Eliminar producto del carrito
router.delete('/:id', cartController.removeFromCart);

module.exports = router;