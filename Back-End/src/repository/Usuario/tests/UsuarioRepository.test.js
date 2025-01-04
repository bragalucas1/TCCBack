const UsuarioRepository = require("../UsuarioRepository");

jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    usuarios: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("UsuarioRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findMany", () => {
    it("should return all users", async () => {
      const mockUsers = [
        { id: 1, nome: "User 1", matricula: "123", senha: "senha1" },
        { id: 2, nome: "User 2", matricula: "456", senha: "senha2" },
      ];

      prisma.usuarios.findMany.mockResolvedValue(mockUsers);

      const result = await UsuarioRepository.findMany();

      expect(prisma.usuarios.findMany).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe("findByMatriculaAndSenha", () => {
    it("should find a user by matricula and senha", async () => {
      const mockMatricula = "123";
      const mockSenha = "senha1";
      const mockUser = {
        id: 1,
        nome: "User 1",
        matricula: "123",
        senha: "senha1",
      };

      prisma.usuarios.findFirst.mockResolvedValue(mockUser);

      const result = await UsuarioRepository.findByMatriculaAndSenha(
        mockMatricula,
        mockSenha
      );

      expect(prisma.usuarios.findFirst).toHaveBeenCalledWith({
        where: {
          matricula: mockMatricula,
          senha: mockSenha,
        },
      });
      expect(result).toEqual(mockUser);
    });
  });

  describe("findByIds", () => {
    it("should find users by ids", async () => {
      const mockIds = [1, 2];
      const mockUsers = [
        { id: 1, nome: "User 1", matricula: "123", senha: "senha1" },
        { id: 2, nome: "User 2", matricula: "456", senha: "senha2" },
      ];

      prisma.usuarios.findMany.mockResolvedValue(mockUsers);

      const result = await UsuarioRepository.findByIds(mockIds);

      expect(prisma.usuarios.findMany).toHaveBeenCalledWith({
        where: {
          id: {
            in: mockIds,
          },
        },
      });
      expect(result).toEqual(mockUsers);
    });
  });
});
