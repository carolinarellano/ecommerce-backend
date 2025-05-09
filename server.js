// server.js
require('dotenv').config();
const express = require('express');
const Sentry = require('@sentry/node');
const Tracing = require('@sentry/tracing');
const cors = require('cors');

const app = express();

// --- 1. Inicializar Sentry ---
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV || 'development',
  integrations: [
    // Habilita trazas de rendimiento
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0, 
});

// --- 2. Middlewares globales ---
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

app.use(cors());                            // Permitir orígenes cruzados
app.use(express.json());                    // Parsear JSON bodies
app.use(express.urlencoded({ extended: true })); // Parsear URL-encoded

// --- 3. Conexión a la base de datos ---
const db = require('./src/config/database');
db.connect()                                 // debe exportar una función connect()

// --- 4. Rutas de la API ---
const productRoutes = require('./src/routes/products');
const authRoutes    = require('./src/routes/auth');
// … importa aquí tus otros routers

app.use('/api/products', productRoutes);
app.use('/api/auth',    authRoutes);
// … monta aquí los demás endpoints

// --- 5. Manejadores de errores ---
app.use(Sentry.Handlers.errorHandler());     // captura errores y los envía a Sentry

// Manejador genérico (responde JSON)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error'
    }
  });
});

// --- 6. Levantar el servidor ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend escuchando en http://localhost:${PORT}`);
});
