const express = require("express");
const atividadeRoute = express.Router();
const upload = require("../config/multerConfig");
const AtividadeController = require("../controllers/Atividade/AtividadeController");

atividadeRoute.post(
  "/cadastroAtividade",
  upload.fields([
    { name: "caminho_pdf", maxCount: 1 },
    { name: "caminho_codigo_base", maxCount: 1 },
    { name: "caminho_codigo_verificacao", maxCount: 1 },
  ]),
  AtividadeController.salvarDadosAtividade
);
atividadeRoute.get("/listarAtividades", AtividadeController.listarAtividades);
atividadeRoute.get(
  "/listarAtividadesProf",
  AtividadeController.listarAtividadesTeacher
);
atividadeRoute.post("/removerAtividade", AtividadeController.deletarAtividade);
atividadeRoute.post(
  "/editarAtividade",
  upload.fields([
    { name: "caminho_pdf", maxCount: 1 },
    { name: "caminho_codigo_base", maxCount: 1 },
    { name: "caminho_codigo_verificacao", maxCount: 1 },
  ]),
  AtividadeController.editarAtividade
);
atividadeRoute.post(
  "/listarAtividadePorId",
  AtividadeController.listarAtividadePorId
);
atividadeRoute.get("/obterPdf", AtividadeController.obterPdfAtiviade);

module.exports = atividadeRoute;
