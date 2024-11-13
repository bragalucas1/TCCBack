const cors = require("cors");
const express = require("express");
const prisma = require("../database/prismaClient");
const usuarioRota = require("../routes/UsuariosRotas");
const authRoute = require("../routes/AutenticacaoRotas");
const correctRoute = require("../routes/CorrecaoRotas");
const atividadeRoute = require("../routes/CadastroAtividadeRotas");
const professorRota = require("../routes/ProfessorRotas");
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

prisma
  .$connect()
  .then(() => {
    console.log("Banco de dados conectado com sucesso!");
  })
  .catch((error) => {
    console.error("Erro ao conectar ao banco de dados:", error);
  });

app.use(authRoute);
app.use(usuarioRota);
app.use(correctRoute);
app.use(atividadeRoute);
app.use(professorRota);

module.exports = app;
