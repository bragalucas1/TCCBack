const express = require("express");
const UsuarioController = require("../controllers/Usuarios/UsuarioController"); // Importa o controller de usuários
const usuarioRota = express.Router();

usuarioRota.get("/usuarios", UsuarioController.getUsers); // Rota para obter usuários
usuarioRota.post("/listarPorID", UsuarioController.listById); // Rota para obter usuários

module.exports = usuarioRota;
