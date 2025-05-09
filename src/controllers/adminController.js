const db = require('../config/database');

/**
 * Renderiza la página de administración con todos los productos.
 */
exports.renderAdmin = async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.render('admin', { products });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar productos');
  }
};

/**
 * Añade un nuevo producto a la base de datos.
 */
exports.addProduct = async (req, res) => {
  const { name, description, price, category, image } = req.body;
  try {
    await db.query('INSERT INTO products (name, description, price, category, image) VALUES (?, ?, ?, ?, ?)', 
      [name, description, price, category, image]);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al agregar producto');
  }
};

/**
 * Elimina un producto de la base de datos.
 */
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al eliminar producto');
  }
};

/**
 * Renderiza el formulario de edición de un producto específico.
 */
exports.editProductForm = async (req, res) => {
  const { id } = req.params;
  try {
    const [products] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    const product = products[0];
    res.render('edit_product', { product });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar producto');
  }
};

/**
 * Actualiza un producto en la base de datos.
 */
exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, category, image } = req.body;
  try {
    await db.query('UPDATE products SET name=?, description=?, price=?, category=?, image=? WHERE id=?', 
      [name, description, price, category, image, id]);
    res.redirect('/admin');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al actualizar producto');
  }
};
