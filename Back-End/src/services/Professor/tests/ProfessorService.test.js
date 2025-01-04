const ProfessorRepository = require("../../../repository/Professor/ProfessorRepository");
const ProfessorService = require("../ProfessorService");

const fs = require("fs").promises;

jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
  existsSync: jest.fn(() => true), // Mock da função `existsSync`
}));
jest.mock("../../../repository/Professor/ProfessorRepository");

describe("ProfessorService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  describe("listarAlunos", () => {
    it("deve listar os alunos corretamente", async () => {
      const mockAlunos = [{ nome: "Aluno 1" }, { nome: "Aluno 2" }];
      ProfessorRepository.listarAlunos.mockResolvedValue(mockAlunos);

      const result = await ProfessorService.listarAlunos();

      expect(result).toEqual(mockAlunos);
      expect(ProfessorRepository.listarAlunos).toHaveBeenCalled();
    });

    it("deve lançar um erro se falhar ao listar alunos", async () => {
      ProfessorRepository.listarAlunos.mockRejectedValue(new Error("DB Error"));

      await expect(ProfessorService.listarAlunos()).rejects.toThrow(
        "Erro ao listar alunos no Banco: DB Error"
      );
    });
  });

  describe("editarAluno", () => {
    it("deve editar um aluno corretamente", async () => {
      const mockAluno = { id: 1, nome: "Aluno Editado" };
      ProfessorRepository.editarAluno.mockResolvedValue(mockAluno);

      const result = await ProfessorService.editarAluno(mockAluno);

      expect(result).toEqual(mockAluno);
      expect(ProfessorRepository.editarAluno).toHaveBeenCalledWith(mockAluno);
    });

    it("deve lançar um erro se falhar ao editar um aluno", async () => {
      ProfessorRepository.editarAluno.mockRejectedValue(new Error("DB Error"));

      await expect(
        ProfessorService.editarAluno({ id: 1, nome: "Aluno" })
      ).rejects.toThrow("Erro ao listar alunos no Banco: DB Error");
    });
  });

  describe("removerAluno", () => {
    it("deve remover um aluno corretamente", async () => {
      ProfessorRepository.removerAluno.mockResolvedValue(true);

      const result = await ProfessorService.removerAluno({ id: 1 });

      expect(result).toBe(true);
      expect(ProfessorRepository.removerAluno).toHaveBeenCalledWith({ id: 1 });
    });

    it("deve lançar um erro se falhar ao remover um aluno", async () => {
      ProfessorRepository.removerAluno.mockRejectedValue(new Error("DB Error"));

      await expect(ProfessorService.removerAluno({ id: 1 })).rejects.toThrow(
        "Erro ao listar alunos no Banco: DB Error"
      );
    });
  });

  describe("cadastrarAluno", () => {
    it("deve cadastrar um aluno corretamente", async () => {
      const mockAluno = { nome: "Novo Aluno" };
      ProfessorRepository.cadastrarAluno.mockResolvedValue(mockAluno);

      const result = await ProfessorService.cadastrarAluno(mockAluno);

      expect(result).toEqual(mockAluno);
      expect(ProfessorRepository.cadastrarAluno).toHaveBeenCalledWith(
        mockAluno
      );
    });

    it("deve lançar um erro se falhar ao cadastrar um aluno", async () => {
      ProfessorRepository.cadastrarAluno.mockRejectedValue(
        new Error("DB Error")
      );

      await expect(
        ProfessorService.cadastrarAluno({ nome: "Novo Aluno" })
      ).rejects.toThrow("Erro ao listar alunos no Banco: DB Error");
    });
  });

  describe("cargaAluno", () => {
    it("deve processar e cadastrar os alunos de um arquivo corretamente", async () => {
      const mockFile = { path: "caminho/do/arquivo.csv" };
      const mockFileContent = "Nome1;123;1;2\nNome2;456;2;3";
      const mockFormattedData = [
        {
          nome: "Nome1",
          matricula: "123",
          turma: 1,
          turmap: 2,
          perfil: 2,
          senha: "123",
        },
        {
          nome: "Nome2",
          matricula: "456",
          turma: 2,
          turmap: 3,
          perfil: 2,
          senha: "456",
        },
      ];

      fs.readFile.mockResolvedValue(mockFileContent);
      ProfessorRepository.cargaAluno.mockResolvedValue(mockFormattedData);

      const result = await ProfessorService.cargaAluno(mockFile);

      expect(result).toEqual(mockFormattedData);
      expect(fs.readFile).toHaveBeenCalledWith(mockFile.path, "utf8");
      expect(ProfessorRepository.cargaAluno).toHaveBeenCalledWith(
        mockFormattedData
      );
    });

    it("deve lançar um erro se falhar ao processar o arquivo", async () => {
      const mockFile = { path: "caminho/do/arquivo.csv" };

      fs.readFile.mockRejectedValue(new Error("Erro ao ler arquivo"));

      await expect(ProfessorService.cargaAluno(mockFile)).rejects.toThrow(
        "Erro ao listar alunos no Banco: Erro ao ler arquivo"
      );
    });
  });
});
