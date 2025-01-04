const AtividadeRepository = require("../AtividadeRepository");

// Mock PrismaClient
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    atividades: {
      create: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // Prisma mockado

describe("AtividadeRepository", () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe("salvarAtividade", () => {
    it("should create a new activity", async () => {
      const mockActivity = {
        nome: "Test Activity",
        tipo: "Prova",
        conteudo: "Test Content",
        data_limite: "2024-01-04T12:00:00Z",
        caminho_pdf: "path/to/pdf",
        caminho_codigo_base: "path/to/code",
      };

      prisma.atividades.create.mockResolvedValue(mockActivity);

      const result = await AtividadeRepository.salvarAtividade(
        mockActivity.nome,
        mockActivity.tipo,
        mockActivity.conteudo,
        mockActivity.data_limite,
        mockActivity.caminho_codigo_base,
        mockActivity.caminho_pdf
      );

      expect(prisma.atividades.create).toHaveBeenCalled();
      expect(result).toEqual(mockActivity);
    });
  });

  describe("listarAtividades", () => {
    it("should return all activities", async () => {
      const mockActivities = [
        { id: 1, nome: "Activity 1" },
        { id: 2, nome: "Activity 2" },
      ];

      prisma.atividades.findMany.mockResolvedValue(mockActivities);

      const result = await AtividadeRepository.listarAtividades();

      expect(prisma.atividades.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockActivities);
    });
  });

  describe("removerAtividade", () => {
    it("should delete an activity", async () => {
      const mockId = 1;
      const mockDeletedActivity = { id: mockId, nome: "Deleted Activity" };

      prisma.atividades.delete.mockResolvedValue(mockDeletedActivity);

      const result = await AtividadeRepository.removerAtividade(mockId);

      expect(prisma.atividades.delete).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(result).toEqual(mockDeletedActivity);
    });
  });

  describe("buscarAtividadePorId", () => {
    it("should find an activity by id", async () => {
      const mockId = 1;
      const mockActivity = {
        id: mockId,
        nome: "Test Activity",
        submissoes: [],
      };

      prisma.atividades.findUnique.mockResolvedValue(mockActivity);

      const result = await AtividadeRepository.buscarAtividadePorId(mockId);

      expect(prisma.atividades.findUnique).toHaveBeenCalledWith({
        where: { id: mockId },
        include: {
          submissoes: {
            orderBy: {
              data_submissao: "desc",
            },
          },
        },
      });
      expect(result).toEqual(mockActivity);
    });
  });

  describe("editarAtividade", () => {
    it("should update an activity", async () => {
      const mockActivity = {
        id: 1,
        nome: "Updated Activity",
        tipo: "Prova",
        conteudo: "Updated Content",
        data_limite: "2024-01-04T12:00:00Z",
      };

      prisma.atividades.update.mockResolvedValue(mockActivity);

      const result = await AtividadeRepository.editarAtividade(mockActivity);

      expect(prisma.atividades.update).toHaveBeenCalled();
      expect(result).toEqual(mockActivity);
    });
  });

  describe("listarAtividadePeloId", () => {
    it("should find an activity by id", async () => {
      const mockId = 1;
      const mockActivity = { id: mockId, nome: "Test Activity" };

      prisma.atividades.findUnique.mockResolvedValue(mockActivity);

      const result = await AtividadeRepository.listarAtividadePeloId(mockId);

      expect(prisma.atividades.findUnique).toHaveBeenCalledWith({
        where: { id: mockId },
      });
      expect(result).toEqual(mockActivity);
    });
  });
});
