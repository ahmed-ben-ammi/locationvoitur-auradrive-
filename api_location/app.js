const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const routes = require('./routes/index');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// Middlewares globaux
app.use(cors({ origin: process.env.CLIENT_URL || "*" }));
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json());

// Servir les fichiers statiques (uploads)
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api', routes); // Toutes les routes commencent par /api/...

// Middleware de gestion des erreurs
app.use(errorHandler);

module.exports = app;

