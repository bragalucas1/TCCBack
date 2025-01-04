const path = require("path");
const fs = require("fs").promises;
const AtividadeRepository = require("@repository/Atividade/AtividadeRepository");
const AtividadeService = require("../AtividadeService");
const ArquivoService = require("../../Arquivo/ArquivoService");

jest.mock("fs", () => ({
  promises: {
    access: jest.fn(),
    readdir: jest.fn(),
    unlink: jest.fn(),
    rmdir: jest.fn(),
    mkdir: jest.fn(),
    rename: jest.fn(),
  },
  existsSync: jest.fn(() => true),
}));
jest.mock("@repository/Atividade/AtividadeRepository");
jest.mock("../../Arquivo/ArquivoService");

describe("AtividadeService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  describe("listarAtividades", () => {
    it("deve listar e processar as atividades corretamente", async () => {
      const mockAtividades = [
        { id: 1, data_limite: "2023-12-31", submissoes: [] },
        { id: 2, data_limite: null, submissoes: [{ id: 1 }] },
      ];
      AtividadeRepository.listarAtividades.mockResolvedValue(mockAtividades);
      ArquivoService.processasSubmissoes.mockResolvedValue([
        { id: 1, status: "processed" },
      ]);

      const result = await AtividadeService.listarAtividades(1);

      expect(result).toEqual([
        { id: 1, data_limite: "2023-12-31T00:00", submissoes: [] },
        {
          id: 2,
          data_limite: "",
          submissoes: [{ id: 1, status: "processed" }],
        },
      ]);
      expect(AtividadeRepository.listarAtividades).toHaveBeenCalledWith(1);
    });

    it("deve lançar um erro ao falhar no repositório", async () => {
      AtividadeRepository.listarAtividades.mockRejectedValue(
        new Error("DB Error")
      );

      await expect(AtividadeService.listarAtividades(1)).rejects.toThrow(
        "Erro ao listar atividades no Banco: DB Error"
      );
    });
  });

  describe("salvarDadosAtividade", () => {
    it("deve salvar os dados da atividade corretamente", async () => {
      AtividadeRepository.salvarAtividade.mockResolvedValue();

      const atividadeData = {
        nome: "Atividade Teste",
        tipo: "Tipo 1",
        conteudo: "Conteúdo",
        dataLimite: "2025-01-01",
        arquivos: {
          caminho_codigo_base: [{ path: "base.js" }],
          caminho_pdf: [{ path: "document.pdf" }],
        },
      };

      await AtividadeService.salvarDadosAtividade(atividadeData);

      expect(AtividadeRepository.salvarAtividade).toHaveBeenCalledWith(
        "Atividade Teste",
        "Tipo 1",
        "Conteúdo",
        "2025-01-01",
        "base.js",
        "document.pdf",
        null
      );
    });

    it("deve lançar um erro ao falhar no repositório", async () => {
      AtividadeRepository.salvarAtividade.mockRejectedValue(
        new Error("DB Error")
      );

      await expect(
        AtividadeService.salvarDadosAtividade({
          nome: "Atividade Teste",
          tipo: "Tipo 1",
          conteudo: "Conteúdo",
          dataLimite: "2025-01-01",
          arquivos: {
            caminho_codigo_base: [{ path: "base.js" }],
            caminho_pdf: [{ path: "document.pdf" }],
          },
        })
      ).rejects.toThrow("Erro ao salvar atividade no Banco: DB Error");
    });
  });

  describe("removerAtividade", () => {
    it("deve remover a atividade corretamente", async () => {
      AtividadeRepository.removerAtividade.mockResolvedValue(true);

      const result = await AtividadeService.removerAtividade(1);

      expect(result).toBe(true);
      expect(AtividadeRepository.removerAtividade).toHaveBeenCalledWith(1);
    });

    it("deve lançar um erro ao falhar no repositório", async () => {
      AtividadeRepository.removerAtividade.mockRejectedValue(
        new Error("DB Error")
      );

      await expect(AtividadeService.removerAtividade(1)).rejects.toThrow(
        "Erro ao remover atividade no Banco: DB Error"
      );
    });
  });

  describe("removerDiretorioAtividade", () => {
    it("deve remover o diretório da atividade corretamente", async () => {
      fs.access.mockResolvedValue();
      fs.readdir.mockResolvedValue(["file1.txt", "file2.txt"]);
      fs.unlink.mockResolvedValue();
      fs.rmdir.mockResolvedValue();

      const result = await AtividadeService.removerDiretorioAtividade(
        "Atividade1"
      );

      expect(result).toBe(true);
      expect(fs.readdir).toHaveBeenCalled();
      expect(fs.unlink).toHaveBeenCalledTimes(2);
      expect(fs.rmdir).toHaveBeenCalled();
    });
  });

  describe("obterPdfAtiviade", () => {
    it("deve obter o caminho do PDF da atividade", async () => {
      fs.access.mockResolvedValue();
      fs.readdir.mockResolvedValue(["file1.txt", "document.pdf"]);

      const result = await AtividadeService.obterPdfAtiviade("Atividade1");
      const expectedPath = path.join(
        process.cwd(),
        "uploads",
        "Atividade1",
        "document.pdf"
      );
      expect(result).toBe(expectedPath);

      expect(fs.readdir).toHaveBeenCalled();
    });

    it("deve lançar um erro quando o PDF não for encontrado", async () => {
      fs.access.mockResolvedValue();
      fs.readdir.mockResolvedValue(["file1.txt"]);

      await expect(
        AtividadeService.obterPdfAtiviade("Atividade1")
      ).rejects.toThrow("PDF não encontrado");
    });
  });

  describe("listarAtividadesTeacher", () => {
    it("deve listar e processar as atividades para professores corretamente", async () => {
      const mockAtividades = [
        { id: 1, data_limite: "2023-12-31", submissoes: [] },
        { id: 2, data_limite: null, submissoes: [{ id: 1 }] },
      ];
      AtividadeRepository.listarAtividades.mockResolvedValue(mockAtividades);
      ArquivoService.processasSubmissoes.mockResolvedValue([
        { id: 1, status: "processed" },
      ]);

      const result = await AtividadeService.listarAtividadesTeacher();

      expect(result).toEqual([
        { id: 1, data_limite: "2023-12-31T00:00", submissoes: [] },
        {
          id: 2,
          data_limite: "",
          submissoes: [{ id: 1, status: "processed" }],
        },
      ]);
      expect(AtividadeRepository.listarAtividades).toHaveBeenCalled();
    });

    it("deve lançar um erro ao falhar no repositório", async () => {
      AtividadeRepository.listarAtividades.mockRejectedValue(
        new Error("DB Error")
      );

      await expect(AtividadeService.listarAtividadesTeacher()).rejects.toThrow(
        "Erro ao listar atividades no Banco: DB Error"
      );
    });
  });

  describe("editarAtividade", () => {
    it("deve editar a atividade corretamente", async () => {
      const mockAtividade = { id: 1, nome: "Atividade Editada" };
      AtividadeRepository.editarAtividade.mockResolvedValue(mockAtividade);

      const result = await AtividadeService.editarAtividade(mockAtividade);

      expect(result).toEqual(mockAtividade);
      expect(AtividadeRepository.editarAtividade).toHaveBeenCalledWith(
        mockAtividade
      );
    });

    it("deve lançar um erro ao falhar no repositório", async () => {
      AtividadeRepository.editarAtividade.mockRejectedValue(
        new Error("DB Error")
      );

      await expect(
        AtividadeService.editarAtividade({ id: 1, nome: "Atividade Editada" })
      ).rejects.toThrow("Erro ao editar atividade no Banco: DB Error");
    });
  });

  describe("buscarAtividadePorId", () => {
    it("deve buscar uma atividade pelo ID corretamente", async () => {
      const mockAtividade = { id: 1, nome: "Atividade Teste" };
      AtividadeRepository.buscarAtividadePorId.mockResolvedValue(mockAtividade);

      const result = await AtividadeService.buscarAtividadePorId(1);

      expect(result).toEqual(mockAtividade);
      expect(AtividadeRepository.buscarAtividadePorId).toHaveBeenCalledWith(1);
    });

    it("deve lançar um erro ao falhar no repositório", async () => {
      AtividadeRepository.buscarAtividadePorId.mockRejectedValue(
        new Error("DB Error")
      );

      await expect(AtividadeService.buscarAtividadePorId(1)).rejects.toThrow(
        "Erro ao buscar atividade por id: DB Error"
      );
    });
  });

  describe("editarAtividadeExistente", () => {
    it("deve editar uma atividade existente corretamente", async () => {
      const mockAtividadeAtual = {
        id: 1,
        nome: "Atividade Atual",
        caminho_pdf: "path/to/old.pdf",
        caminho_codigo_base: "path/to/old_code.js",
      };

      const atividadeData = {
        id: 1,
        nome: "Nova Atividade",
        tipo: "Exercício",
        dataLimite: "2025-01-01T00:00",
        conteudo: "Novo Conteúdo",
        arquivos: {
          caminho_pdf: [{ path: "path/to/new.pdf" }],
          caminho_codigo_base: [{ path: "path/to/new_code.js" }],
        },
      };

    AtividadeService.buscarAtividadePorId = jest.fn().mockResolvedValue(
        mockAtividadeAtual
    );
    AtividadeRepository.editarAtividade.mockResolvedValue(atividadeData);

    const result = await AtividadeService.editarAtividadeExistente(
        atividadeData
    );

    expect(result).toEqual(atividadeData);
    expect(AtividadeRepository.editarAtividade).toHaveBeenCalled();
    });

    it("deve lançar um erro se a atividade não for encontrada", async () => {
      AtividadeService.buscarAtividadePorId.mockResolvedValue(null);

      const atividadeData = {
        id: 1,
        nome: "Nova Atividade",
      };

      await expect(
        AtividadeService.editarAtividadeExistente(atividadeData)
      ).rejects.toThrow();
    });
  });
});
