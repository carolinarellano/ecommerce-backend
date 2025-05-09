const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Asegúrate de que authController.registro sea una función
router.post('/register', authController.register); 

// Asegúrate de que authController.login sea una función
router.post('/login', authController.login);

module.exports = router;