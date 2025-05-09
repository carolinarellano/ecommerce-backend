// const jwt = require('jsonwebtoken');
// const db = require('../config/database');
// const bcrypt = require('bcryptjs');

// const registerUser = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;
    
//     // Validación básica
//     if (!name || !email || !password) {
//       return res.status(400).json({ error: 'Todos los campos son requeridos' });
//     }

//     // Verificar si el usuario ya existe
//     const [existingUser] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
//     if (existingUser.length > 0) {
//       return res.status(400).json({ error: 'El email ya está registrado' });
//     }

//     // Hash de la contraseña
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Crear usuario
//     const [result] = await db.query(
//       'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
//       [name, email, hashedPassword]
//     );

//     // Generar token JWT
//     const token = jwt.sign(
//       { userId: result.insertId },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     // Configurar cookie segura
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 24 * 60 * 60 * 1000 // 24 horas
//     });

//     res.status(201).json({ 
//       message: 'Usuario registrado exitosamente',
//       user: { id: result.insertId, name, email }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Validación básica
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Email y contraseña son requeridos' });
//     }

//     // Buscar usuario
//     const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
//     if (users.length === 0) {
//       return res.status(401).json({ error: 'Credenciales inválidas' });
//     }

//     const user = users[0];

//     // Verificar contraseña
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(401).json({ error: 'Credenciales inválidas' });
//     }

//     // Generar token JWT
//     const token = jwt.sign(
//       { userId: user.id },
//       process.env.JWT_SECRET,
//       { expiresIn: '24h' }
//     );

//     // Configurar cookie segura
//     res.cookie('token', token, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === 'production',
//       maxAge: 24 * 60 * 60 * 1000 // 24 horas
//     });

//     res.json({ 
//       message: 'Inicio de sesión exitoso',
//       user: { id: user.id, name: user.name, email: user.email }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// const logoutUser = (req, res) => {
//   res.clearCookie('token');
//   res.json({ message: 'Sesión cerrada exitosamente' });
// };

// const getCurrentUser = async (req, res) => {
//   try {
//     const [user] = await db.query(
//       'SELECT id, name, email FROM users WHERE id = ?',
//       [req.user.userId]
//     );
    
//     if (user.length === 0) {
//       return res.status(404).json({ error: 'Usuario no encontrado' });
//     }

//     res.json(user[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   registerUser,
//   loginUser,
//   logoutUser,
//   getCurrentUser
// };

const pool = require('../config/database');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Registrar nuevo usuario
exports.register = async ({ name, email, password }) => {
  // Verificar si el usuario ya existe
  const [[user]] = await pool.query(
    'SELECT id FROM users WHERE email = ?', 
    [email]
  );

  if (user) {
    throw new Error('El email ya está registrado');
  }

  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 12);
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;

  // Crear usuario
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, avatar) 
     VALUES (?, ?, ?, ?)`,
    [name, email, hashedPassword, avatar]
  );

  // Generar token JWT
  const token = jwt.sign(
    { userId: result.insertId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { 
    user: { id: result.insertId, name, email, avatar },
    token 
  };
};

// Login de usuario
exports.login = async (email, password) => {
  // Verificar usuario
  const [[user]] = await pool.query(
    'SELECT id, name, email, password, avatar FROM users WHERE email = ?', 
    [email]
  );

  if (!user) {
    throw new Error('Credenciales inválidas');
  }

  // Verificar contraseña
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Credenciales inválidas');
  }

  // Generar token JWT
  const token = jwt.sign(
    { userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );

  return { 
    user: { 
      id: user.id, 
      name: user.name, 
      email: user.email,
      avatar: user.avatar 
    },
    token 
  };
};