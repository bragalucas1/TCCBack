const fs = require("fs").promises;
const zlib = require("zlib");
const util = require("util");
const ArquivoService = require("../ArquivoService");

// Mock das dependências
jest.mock("fs", () => ({
  promises: {
    readFile: jest.fn(),
  },
}));
jest.mock("zlib", () => ({
  gzip: jest.fn(),
  gunzip: jest.fn(),
  gunzipSync: jest.fn(), // Incluímos o gunzipSync no mock
}));

describe("ArquivoService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  describe("comprimirArquivo", () => {
    it("deve comprimir o arquivo corretamente", async () => {
      const mockArquivo = Buffer.from("conteúdo do arquivo");
      const mockArquivoComprimido = Buffer.from("arquivo comprimido");

      fs.readFile.mockResolvedValue(mockArquivo);
      zlib.gzip.mockImplementation((data, callback) =>
        callback(null, mockArquivoComprimido)
      );

      const result = await ArquivoService.comprimirArquivo(
        "caminho/arquivo.txt"
      );

      expect(result).toEqual(mockArquivoComprimido);
      expect(fs.readFile).toHaveBeenCalledWith("caminho/arquivo.txt");
      expect(zlib.gzip).toHaveBeenCalledWith(mockArquivo, expect.any(Function));
    });

    it("deve lançar um erro se falhar ao comprimir o arquivo", async () => {
      fs.readFile.mockRejectedValue(new Error("Erro ao ler arquivo"));

      await expect(
        ArquivoService.comprimirArquivo("caminho/arquivo.txt")
      ).rejects.toThrow("Erro ao comprimir arquivo: Erro ao ler arquivo");
    });
  });

  describe("descomprimirArquivo", () => {
    it("deve descomprimir o arquivo corretamente", async () => {
      const mockArquivoComprimido = Buffer.from("arquivo comprimido");
      const mockArquivoDescomprimido = "conteúdo do arquivo";

      fs.readFile.mockResolvedValue(mockArquivoComprimido);
      zlib.gunzipSync.mockImplementation(() =>
        Buffer.from(mockArquivoDescomprimido)
      );

      const result = await ArquivoService.descomprimirArquivo(
        "caminho/arquivo.gz"
      );

      expect(result).toBe(mockArquivoDescomprimido);
      expect(fs.readFile).toHaveBeenCalledWith("caminho/arquivo.gz");
      expect(zlib.gunzipSync).toHaveBeenCalledWith(mockArquivoComprimido);
    });

    it("deve lançar um erro se falhar ao descomprimir o arquivo", async () => {
      fs.readFile.mockRejectedValue(
        new Error("Erro ao ler arquivo comprimido")
      );

      await expect(
        ArquivoService.descomprimirArquivo("caminho/arquivo.gz")
      ).rejects.toThrow(
        "Erro ao descomprimir arquivo: Erro ao ler arquivo comprimido"
      );
    });
  });

  describe("processasSubmissoes", () => {
    it("deve processar as submissões e descomprimir os códigos corretamente", async () => {
      const mockSubmissoes = [
        { id: 1, codigo_comprimido: Buffer.from("comprimido 1") },
        { id: 2, codigo_comprimido: Buffer.from("comprimido 2") },
      ];
      const mockDescomprimido1 = Buffer.from("descomprimido 1");
      const mockDescomprimido2 = Buffer.from("descomprimido 2");

      jest
        .spyOn(zlib, "gunzip")
        .mockImplementation((data, callback) =>
          callback(
            null,
            data.toString("utf-8").includes("1")
              ? mockDescomprimido1
              : mockDescomprimido2
          )
        );

      const result = await ArquivoService.processasSubmissoes(mockSubmissoes);

      expect(result).toEqual([
        {
          id: 1,
          codigo_comprimido: Buffer.from("comprimido 1"),
          codigo: "descomprimido 1",
        },
        {
          id: 2,
          codigo_comprimido: Buffer.from("comprimido 2"),
          codigo: "descomprimido 2",
        },
      ]);
      expect(zlib.gunzip).toHaveBeenCalledTimes(2);
    });

    it("deve retornar a submissão original se falhar ao descomprimir", async () => {
      const mockSubmissoes = [
        { id: 1, codigo_comprimido: Buffer.from("comprimido") },
      ];
      jest
        .spyOn(zlib, "gunzip")
        .mockImplementation((data, callback) =>
          callback(new Error("Erro ao descomprimir"), null)
        );

      const result = await ArquivoService.processasSubmissoes(mockSubmissoes);

      expect(result).toEqual(mockSubmissoes);
      expect(zlib.gunzip).toHaveBeenCalledTimes(1);
    });
  });

  describe("lerArquivoEntrada", () => {
    it("deve processar corretamente o arquivo de entrada", async () => {
      const mockConteudo = "1,2,3\n4,5,9\n";
      const mockEntradas = [
        { numero1: 1, numero2: 2, resultadoEsperado: 3 },
        { numero1: 4, numero2: 5, resultadoEsperado: 9 },
      ];

      fs.readFile.mockResolvedValue(Buffer.from(mockConteudo, "utf-8"));

      const result = await ArquivoService.lerArquivoEntrada(
        "caminho/arquivo.txt"
      );

      expect(result).toEqual(mockEntradas);
      expect(fs.readFile).toHaveBeenCalledWith("caminho/arquivo.txt");
    });

    it("deve lançar um erro se falhar ao ler o arquivo", async () => {
      fs.readFile.mockRejectedValue(new Error("Erro ao ler arquivo"));

      await expect(
        ArquivoService.lerArquivoEntrada("caminho/arquivo.txt")
      ).rejects.toThrow("Erro ao ler arquivo de entrada: Erro ao ler arquivo");
    });
  });
});
