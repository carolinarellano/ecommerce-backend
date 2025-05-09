const mysql = require('mysql2/promise');

let pool;
module.exports.connect = async () => {
  pool = await mysql.createPool({
    host:     process.env.DB_HOST,
    user:     process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
  });
  console.log('✅ Conectado a MySQL');
};

module.exports.getPool = () => pool;
