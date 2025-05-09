const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * Renderiza la página principal (Home) con todos los productos.
 */
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.render('home', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar productos');
  }
});

module.exports = router;
