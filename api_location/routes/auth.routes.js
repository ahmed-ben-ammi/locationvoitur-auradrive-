// auth.routes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route pour l'inscription
router.post('/register', authController.register);

// Route pour l'inscription admin
router.post('/register-admin', authController.registerAdmin);

// Route pour la connexion
router.post('/login', authController.login);

module.exports = router;
