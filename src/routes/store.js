const express = require('express');
const router = express.Router();
const db = require('../config/database');

/**
 * Renderiza todos los productos en una sola página (tienda completa).
 */
router.get('/', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.render('products', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar productos');
  }
});

module.exports = router;
