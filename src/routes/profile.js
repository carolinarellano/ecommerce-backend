const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth'); // Protección de rutas privadas
const db = require('../config/database');

/**
 * Renderiza la página de perfil del usuario.
 * Esta ruta debe estar protegida: solo usuarios logueados pueden acceder.
 */
router.get('/', authMiddleware.isAuthenticated, async (req, res) => {
  try {
    // Aquí asumimos que guardaste el ID del usuario en la sesión o token JWT
    const userId = req.user.id; // Este req.user lo setea el middleware auth.js

    const [rows] = await db.query('SELECT id, name, email, created_at FROM users WHERE id = ?', [userId]);
    const user = rows[0];

    res.render('profile', { user });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error al cargar el perfil');
  }
});

module.exports = router;
