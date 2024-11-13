const fs = require("fs").promises;
const { format } = require("path");
const ProfessorRepository = require("../../repository/Professor/ProfessorRepository");

const ProfessorService = {
  listarAlunos: async () => {
    try {
      const alunos = await ProfessorRepository.listarAlunos();
      return alunos;
    } catch (error) {
      throw new Error("Erro ao listar alunos no Banco: " + error.message);
    }
  },
  editarAluno: async (aluno) => {
    try {
      const result = await ProfessorRepository.editarAluno(aluno);
      return result;
    } catch (error) {
      throw new Error("Erro ao listar alunos no Banco: " + error.message);
    }
  },
  removerAluno: async (aluno) => {
    try {
      const result = await ProfessorRepository.removerAluno(aluno);
      return result;
    } catch (error) {
      throw new Error("Erro ao listar alunos no Banco: " + error.message);
    }
  },
  cadastrarAluno: async (aluno) => {
    try {
      const result = await ProfessorRepository.cadastrarAluno(aluno);
      return result;
    } catch (error) {
      throw new Error("Erro ao listar alunos no Banco: " + error.message);
    }
  },
  cargaAluno: async (file) => {
    try {
      const fileContent = await fs.readFile(file.path, "utf8");
      const formattedData = fileContent
        .split("\n")
        .map((line) => line.split(";"))
        .map(([nome, matricula, turma]) => ({
          nome,
          matricula,
          turma: Number(turma.replace("\r", "")),
          perfil: 2,
          senha: matricula,
        }));

      console.log(formattedData);

      const result = await ProfessorRepository.cargaAluno(formattedData);
      return result;
    } catch (error) {
      throw new Error("Erro ao listar alunos no Banco: " + error.message);
    }
  },
};

module.exports = ProfessorService;
