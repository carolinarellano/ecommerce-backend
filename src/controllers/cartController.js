const db = require('../config/database');

const getCart = async (req, res) => {
  try {
    const [cartItems] = await db.query(
      `SELECT c.id, p.id as product_id, p.name, p.price, p.image_url, c.quantity 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.userId]
    );

    // Calcular total
    const total = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );

    res.json({ items: cartItems, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addToCart = async (req, res) => {
  try {
    const { product_id, quantity } = req.body;

    // Verificar si el producto existe
    const [product] = await db.query(
      'SELECT id, stock FROM products WHERE id = ?',
      [product_id]
    );

    if (product.length === 0) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Verificar stock disponible
    if (product[0].stock < quantity) {
      return res.status(400).json({ 
        error: 'Cantidad solicitada excede el stock disponible',
        availableStock: product[0].stock
      });
    }

    // Verificar si el producto ya está en el carrito
    const [existingItem] = await db.query(
      'SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?',
      [req.user.userId, product_id]
    );

    if (existingItem.length > 0) {
      // Actualizar cantidad si ya existe
      const newQuantity = existingItem[0].quantity + quantity;
      await db.query(
        'UPDATE cart SET quantity = ? WHERE id = ?',
        [newQuantity, existingItem[0].id]
      );
    } else {
      // Agregar nuevo item al carrito
      await db.query(
        'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [req.user.userId, product_id, quantity]
      );
    }

    res.status(201).json({ message: 'Producto agregado al carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateCartItem = async (req, res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;

    // Verificar si el item existe
    const [cartItem] = await db.query(
      `SELECT c.id, p.stock 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.id = ? AND c.user_id = ?`,
      [id, req.user.userId]
    );

    if (cartItem.length === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito' });
    }

    // Verificar stock disponible
    if (cartItem[0].stock < quantity) {
      return res.status(400).json({ 
        error: 'Cantidad solicitada excede el stock disponible',
        availableStock: cartItem[0].stock
      });
    }

    // Actualizar cantidad
    await db.query(
      'UPDATE cart SET quantity = ? WHERE id = ?',
      [quantity, id]
    );

    res.json({ message: 'Carrito actualizado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const [result] = await db.query(
      'DELETE FROM cart WHERE id = ? AND user_id = ?',
      [req.params.id, req.user.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito' });
    }

    res.json({ message: 'Producto removido del carrito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};