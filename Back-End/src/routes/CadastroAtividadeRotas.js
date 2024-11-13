const express = require("express");
const atividadeRoute = express.Router();
const upload = require("../config/multerConfig");
const AtividadeController = require("../controllers/Atividade/AtividadeController");

atividadeRoute.post(
  "/cadastroAtividade",
  upload.fields([
    { name: "caminho_pdf", maxCount: 1 },
    { name: "caminho_codigo_base", maxCount: 1 },
  ]),
  AtividadeController.salvarDadosAtividade
);

atividadeRoute.get("/listarAtividades", AtividadeController.listarAtividades);
atividadeRoute.post("/removerAtividade", AtividadeController.deletarAtividade);
atividadeRoute.post(
  "/editarAtividade",
  upload.fields([
    { name: "caminho_pdf", maxCount: 1 },
    { name: "caminho_codigo_base", maxCount: 1 },
  ]),
  AtividadeController.editarAtividade
);

module.exports = atividadeRoute;
