const ArquivoService = require("../../Arquivo/ArquivoService");
const AtividadeService = require("../../Atividade/AtividadeService");
const CorrecaoService = require("../CorrecaoService");

jest.mock("../../Atividade/AtividadeService");
jest.mock("../../Arquivo/ArquivoService");

describe("CorrecaoService - fluxoDeCorrecao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("deve chamar corrigirComEntradas quando a atividade possui verificações", async () => {
    const mockFile = { path: "caminho/do/arquivo/aluno.py" };
    const mockAtividade = {
      possui_verificacao: true,
    };

    AtividadeService.buscarAtividadePorId.mockResolvedValue(mockAtividade);
    ArquivoService.comprimirArquivo.mockResolvedValue("conteudoComprimido");
    jest
      .spyOn(CorrecaoService, "corrigirComEntradas")
      .mockResolvedValue("resultado");

    const result = await CorrecaoService.fluxoDeCorrecao(
      mockFile,
      1, // userId
      "John Doe", // userName
      1 // activityId
    );

    expect(AtividadeService.buscarAtividadePorId).toHaveBeenCalledWith(1);
    expect(ArquivoService.comprimirArquivo).toHaveBeenCalledWith(mockFile.path);
    expect(CorrecaoService.corrigirComEntradas).toHaveBeenCalledWith(
      mockFile.path,
      mockAtividade,
      1,
      "John Doe",
      1,
      "conteudoComprimido"
    );
    expect(result).toBe("resultado");
  });

  it("deve chamar corrigirFluxoSimples quando a atividade não possui verificações", async () => {
    const mockFile = { path: "caminho/do/arquivo/aluno.py" };
    const mockAtividade = {
      possui_verificacao: false,
    };

    AtividadeService.buscarAtividadePorId.mockResolvedValue(mockAtividade);
    ArquivoService.comprimirArquivo.mockResolvedValue("conteudoComprimido");
    jest
      .spyOn(CorrecaoService, "corrigirFluxoSimples")
      .mockResolvedValue("resultado");

    const result = await CorrecaoService.fluxoDeCorrecao(
      mockFile,
      1, // userId
      "John Doe", // userName
      1 // activityId
    );

    expect(CorrecaoService.corrigirFluxoSimples).toHaveBeenCalledWith(
      mockFile.path,
      mockAtividade,
      1,
      "John Doe",
      1,
      "conteudoComprimido"
    );
    expect(result).toBe("resultado");
  });

  it("deve lançar um erro se houver falha no processo", async () => {
    AtividadeService.buscarAtividadePorId.mockRejectedValue(
      new Error("Erro na busca da atividade")
    );

    await expect(
      CorrecaoService.fluxoDeCorrecao({ path: "arquivo" }, 1, "John Doe", 1)
    ).rejects.toThrow("Erro na busca da atividade");
  });
});

describe("CorrecaoService - corrigirComEntradas", () => {
  it("deve retornar erro se algum resultado for incorreto", async () => {
    ArquivoService.lerArquivoEntrada.mockResolvedValue([
      { numero1: 1, numero2: 2 },
    ]);
    jest.spyOn(CorrecaoService, "compararExecucoes").mockResolvedValue([
      {
        correto: false,
        erro: true,
        detalhesErro: "Erro no código",
        saidaAluno: "2",
        saidaBase: "3",
      },
    ]);
    jest.spyOn(CorrecaoService, "atualizarSubmissao").mockResolvedValue();

    const result = await CorrecaoService.corrigirComEntradas(
      "arquivoAluno",
      { caminho_codigo_verificacao: "verificacao.py" },
      1,
      "John Doe",
      1,
      "conteudoComprimido"
    );

    expect(result).toEqual("resultado");
  });

  it("deve retornar sucesso se todos os resultados forem corretos", async () => {
    ArquivoService.lerArquivoEntrada.mockResolvedValue([
      { numero1: 1, numero2: 2 },
    ]);
    jest.spyOn(CorrecaoService, "compararExecucoes").mockResolvedValue([
      {
        correto: true,
        erro: false,
        saidaAluno: "3",
        saidaBase: "3",
      },
    ]);
    jest.spyOn(CorrecaoService, "atualizarSubmissao").mockResolvedValue();

    const result = await CorrecaoService.corrigirComEntradas(
      "arquivoAluno",
      { caminho_codigo_verificacao: "verificacao.py" },
      1,
      "John Doe",
      1,
      "conteudoComprimido"
    );

    expect(result).toEqual("resultado");
  });
});
