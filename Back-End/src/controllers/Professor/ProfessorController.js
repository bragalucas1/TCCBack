const ProfessorService = require("../../services/Professor/ProfessorService");

const ProfessorController = {
  listarAlunos: async (req, res) => {
    try {
      const alunos = await ProfessorService.listarAlunos();
      res.status(200).json({ success: true, alunos });
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar alunos." });
    }
  },
  editarAluno: async (req, res) => {
    try {
      aluno = req.body;
      const alunos = await ProfessorService.editarAluno(aluno);
      res.status(200).json({ success: true, alunos });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao editar alunos." });
    }
  },
  removerAluno: async (req, res) => {
    try {
      aluno = req.body;
      console.log(aluno);
      const alunos = await ProfessorService.removerAluno(aluno);
      res.status(200).json({ success: true, alunos });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao remover alunos." });
    }
  },
  cadastrarAluno: async (req, res) => {
    try {
      aluno = req.body;
      const alunos = await ProfessorService.cadastrarAluno(aluno);
      res.status(200).json({ success: true, alunos });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao cadastrar alunos." });
    }
  },
  cargaAlunos: async (req, res) => {
    try {
      const formData = req.file;
      const alunos = await ProfessorService.cargaAluno(formData);
      res.status(200).json({ success: true, alunos });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao dar carga em alunos." });
    }
  },
};

module.exports = ProfessorController;
