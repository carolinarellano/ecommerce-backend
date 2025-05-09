const db = require('../config/database');

const createOrder = async (req, res) => {
  try {
    // Obtener items del carrito
    const [cartItems] = await db.query(
      `SELECT c.product_id, c.quantity, p.price 
       FROM cart c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = ?`,
      [req.user.userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ error: 'El carrito está vacío' });
    }

    // Calcular total
    const total = cartItems.reduce(
      (sum, item) => sum + (item.price * item.quantity), 0
    );

    // Iniciar transacción
    await db.beginTransaction();

    try {
      // Crear orden
      const [orderResult] = await db.query(
        'INSERT INTO orders (user_id, total) VALUES (?, ?)',
        [req.user.userId, total]
      );
      const orderId = orderResult.insertId;

      // Agregar items a la orden
      for (const item of cartItems) {
        await db.query(
          `INSERT INTO order_items 
          (order_id, product_id, quantity, price) 
          VALUES (?, ?, ?, ?)`,
          [orderId, item.product_id, item.quantity, item.price]
        );

        // Actualizar stock
        await db.query(
          'UPDATE products SET stock = stock - ? WHERE id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Vaciar carrito
      await db.query(
        'DELETE FROM cart WHERE user_id = ?',
        [req.user.userId]
      );

      // Confirmar transacción
      await db.commit();

      // Obtener orden completa
      const [order] = await db.query(
        `SELECT o.id, o.total, o.created_at, 
         oi.product_id, oi.quantity, oi.price,
         p.name, p.image_url
         FROM orders o
         JOIN order_items oi ON o.id = oi.order_id
         JOIN products p ON oi.product_id = p.id
         WHERE o.id = ?`,
        [orderId]
      );

      res.status(201).json({
        message: 'Orden creada exitosamente',
        order: {
          id: orderId,
          total,
          items: order
        }
      });
    } catch (error) {
      // Revertir transacción en caso de error
      await db.rollback();
      throw error;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderHistory = async (req, res) => {
  try {
    const [orders] = await db.query(
      `SELECT o.id, o.total, o.created_at 
       FROM orders o
       WHERE o.user_id = ?
       ORDER BY o.created_at DESC`,
      [req.user.userId]
    );

    // Obtener items para cada orden
    for (const order of orders) {
      const [items] = await db.query(
        `SELECT oi.product_id, oi.quantity, oi.price,
         p.name, p.image_url
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [order.id]
      );
      order.items = items;
    }

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const [order] = await db.query(
      `SELECT o.id, o.total, o.created_at 
       FROM orders o
       WHERE o.id = ? AND o.user_id = ?`,
      [req.params.id, req.user.userId]
    );

    if (order.length === 0) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    const [items] = await db.query(
      `SELECT oi.product_id, oi.quantity, oi.price,
       p.name, p.image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?`,
      [req.params.id]
    );

    res.json({
      ...order[0],
      items
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createOrder,
  getOrderHistory,
  getOrderById
};