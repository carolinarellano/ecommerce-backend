const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/auth');

router.use(verifyToken); // Verificar token para todas las rutas del carrito

// Crear nueva orden (checkout)
router.post('/', orderController.createOrder);

// Obtener historial de pedidos
router.get('/', orderController.getOrderHistory);

// Obtener detalles de un pedido específico
router.get('/:id', orderController.getOrderById);

module.exports = router;