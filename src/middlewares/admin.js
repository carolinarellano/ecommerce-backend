const db = require('../config/database');
const authMiddleware = require('./auth');

module.exports = [authMiddleware, async (req, res, next) => {
  try {
    // Verificar si el usuario es admin
    const [user] = await db.query(
      'SELECT role FROM users WHERE id = ?',
      [req.user.id]
    );
    
    if (!user || user.length === 0 || user[0].role !== 'admin') {
      return res.status(403).json({ error: 'Acceso denegado - Se requieren privilegios de administrador' });
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: 'Error al verificar rol de usuario' });
  }
}];