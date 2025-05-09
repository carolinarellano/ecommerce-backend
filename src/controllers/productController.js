const db = require('../config/database');
const { validationResult } = require('express-validator');
const generateUUID = require('../utils/generateUUID');

// Obtener todos los productos
const getAllProducts = async (req, res) => {
  try {
    let query = 'SELECT * FROM products';
    const params = [];

    // Filtrado por categoría
    if (req.query.category) {
      query += ' WHERE category = ?';
      params.push(req.query.category);
    }

    // Búsqueda por título
    if (req.query.search) {
      query += req.query.category ? ' AND' : ' WHERE';
      query += ' title LIKE ?';
      params.push(`%${req.query.search}%`);
    }

    // Paginación
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const [products] = await db.query(query, params);

    const [total] = await db.query('SELECT COUNT(*) as total FROM products');

    res.json({
      products,
      pagination: {
        total: total[0].total,
        page,
        limit,
        totalPages: Math.ceil(total[0].total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener un producto por UUID
const getProductByUUID = async (req, res) => {
  try {
    const [product] = await db.query(
      'SELECT * FROM products WHERE uuid = ?',
      [req.params.uuid]
    );

    if (product.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo producto
const createProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { title, description, pricePerUnit, stock, imageURL, category, unit } = req.body;
    const uuid = generateUUID(); // Generar UUID único

    const [result] = await db.query(
      `INSERT INTO products 
      (uuid, title, description, pricePerUnit, stock, imageURL, category, unit) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [uuid, title, description, pricePerUnit, stock, imageURL, category, unit]
    );

    const [newProduct] = await db.query(
      'SELECT * FROM products WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(newProduct[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un producto por UUID
const updateProduct = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { uuid } = req.params;
    const { title, description, pricePerUnit, stock, imageURL, category, unit } = req.body;

    const [result] = await db.query(
      `UPDATE products SET 
      title = ?, description = ?, pricePerUnit = ?, 
      stock = ?, imageURL = ?, category = ?, unit = ?
      WHERE uuid = ?`,
      [title, description, pricePerUnit, stock, imageURL, category, unit, uuid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    const [updatedProduct] = await db.query(
      'SELECT * FROM products WHERE uuid = ?',
      [uuid]
    );

    res.json(updatedProduct[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un producto por UUID
const deleteProduct = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM products WHERE uuid = ?',
      [req.params.uuid]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json({ message: 'Producto eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getAllProducts,
  getProductByUUID,
  createProduct,
  updateProduct,
  deleteProduct
};
