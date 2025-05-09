const jwt = require('jsonwebtoken');
const db = require('../config/database');

// Middleware para verificar el token
const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Acceso no autorizado - Token requerido' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [user] = await db.query(
      'SELECT id, name, email FROM users WHERE id = ?', 
      [decoded.userId]
    );

    if (!user || user.length === 0) {
      return res.status(401).json({ error: 'Usuario no encontrado' });
    }

    req.user = user[0];
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Token inválido' });
    }
    res.status(500).json({ error: 'Error de autenticación' });
  }
};

// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next();
  } else {
    return res.status(401).json({ error: 'Acceso no autorizado' });
  }
};

// Exportar ambos correctamente
module.exports = {
  verifyToken,
  isAuthenticated
};
