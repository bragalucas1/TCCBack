const express = require('express');
const AutenticacaoController = require('../controllers/Autenticacao/AutenticacaoController');
const authRoute = express.Router();

authRoute.post('/login', AutenticacaoController.login); // Rota para obter usuários

module.exports = authRoute;
