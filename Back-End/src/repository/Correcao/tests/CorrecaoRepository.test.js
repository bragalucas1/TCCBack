const CorrecaoRepository = require("../CorrecaoRepository");

jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    submissoes: {
      upsert: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); 

describe("CorrecaoRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks(); 
  });

  describe("atualizarSubmissao", () => {
    it("should create or update a submission", async () => {
      const mockInput = {
        userId: 1,
        userName: "Test User",
        activityId: 2,
        status: "Correto",
        conteudoArquivoComprimido: Buffer.from("comprimido"),
      };

      const mockOutput = {
        usuario_id: 1,
        nome_usuario: "Test User",
        atividade_id: 2,
        status: "Correto",
        quantidade_sub: 1,
        codigo_comprimido: Buffer.from("comprimido"),
      };

      prisma.submissoes.upsert.mockResolvedValue(mockOutput);

      const result = await CorrecaoRepository.atualizarSubmissao(
        mockInput.userId,
        mockInput.userName,
        mockInput.activityId,
        mockInput.status,
        mockInput.conteudoArquivoComprimido
      );

      expect(prisma.submissoes.upsert).toHaveBeenCalledWith({
        where: {
          usuario_id_atividade_id: {
            usuario_id: mockInput.userId,
            atividade_id: mockInput.activityId,
          },
        },
        update: {
          status: mockInput.status,
          quantidade_sub: {
            increment: 1,
          },
          codigo_comprimido: mockInput.conteudoArquivoComprimido,
        },
        create: {
          usuario_id: mockInput.userId,
          nome_usuario: mockInput.userName,
          atividade_id: mockInput.activityId,
          status: mockInput.status,
          quantidade_sub: 1,
          codigo_comprimido: mockInput.conteudoArquivoComprimido,
        },
      });

      expect(result).toEqual(mockOutput);
    });
  });
});
