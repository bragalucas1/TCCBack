const express = require("express");
const ProfessorController = require("../controllers/Professor/ProfessorController");
const upload = require("../config/multerConfig");
const professorRota = express.Router();

professorRota.get("/listarAlunos", ProfessorController.listarAlunos);
professorRota.post("/editarAluno", ProfessorController.editarAluno);
professorRota.post("/removerAluno", ProfessorController.removerAluno);
professorRota.post("/cadastrarAluno", ProfessorController.cadastrarAluno);
professorRota.post(
  "/cargaAlunos",
  upload.single("file"),
  ProfessorController.cargaAlunos
);

module.exports = professorRota;
