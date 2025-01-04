const SubmissoesRepository = require("../SubmissoesRepository");

jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    submissoes: {
      delete: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

describe("SubmissoesRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("removeSubmition", () => {
    it("should delete a submission by id", async () => {
      const mockId = 1;
      const mockDeletedSubmition = { id: mockId, nome: "Deleted Submission" };

      prisma.submissoes.delete.mockResolvedValue(mockDeletedSubmition);

      const result = await SubmissoesRepository.removeSubmition(mockId);

      expect(prisma.submissoes.delete).toHaveBeenCalledWith({
        where: { id: mockId },
      });

      expect(result).toEqual(mockDeletedSubmition);
    });
  });
});
