const express = require('express');
const CorrecaoController = require('../controllers/Correcao/CorrecaoController');
const correctRoute = express.Router();
const upload = require('../config/multerConfig');

correctRoute.post('/correcao', upload.single('file'), CorrecaoController.corrigir); // Rota para obter usuários

module.exports = correctRoute;
