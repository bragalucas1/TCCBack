const ProfessorRepository = require("../ProfessorRepository");

// Mock PrismaClient
jest.mock("@prisma/client", () => {
  const mockPrismaClient = {
    usuarios: {
      findMany: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      create: jest.fn(),
      createMany: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mockPrismaClient),
  };
});

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient(); // Prisma mockado

describe("ProfessorRepository", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa todos os mocks antes de cada teste
  });

  describe("listarAlunos", () => {
    it("should return a list of students", async () => {
      const mockStudents = [
        { id: 1, nome: "Student 1", matricula: "123", turma: "A", turmap: 1 },
        { id: 2, nome: "Student 2", matricula: "456", turma: "B", turmap: 2 },
      ];

      prisma.usuarios.findMany.mockResolvedValue(mockStudents);

      const result = await ProfessorRepository.listarAlunos();

      expect(prisma.usuarios.findMany).toHaveBeenCalledWith({
        select: {
          nome: true,
          matricula: true,
          turma: true,
          turmap: true,
          id: true,
        },
        where: {
          perfil: 2,
        },
      });
      expect(result).toEqual(mockStudents);
    });
  });

  describe("editarAluno", () => {
    it("should update a student", async () => {
      const mockStudent = {
        id: 1,
        nome: "Updated Student",
        turma: "C",
        turmap: 3,
        matricula: "789",
      };

      prisma.usuarios.update.mockResolvedValue(mockStudent);

      const result = await ProfessorRepository.editarAluno(mockStudent);

      expect(prisma.usuarios.update).toHaveBeenCalledWith({
        where: { id: mockStudent.id },
        data: {
          nome: mockStudent.nome,
          turma: mockStudent.turma,
          turmap: mockStudent.turmap,
          matricula: mockStudent.matricula,
        },
      });
      expect(result).toEqual(mockStudent);
    });
  });

  describe("removerAluno", () => {
    it("should delete a student", async () => {
      const mockStudent = { id: 1, nome: "Deleted Student" };

      prisma.usuarios.delete.mockResolvedValue(mockStudent);

      const result = await ProfessorRepository.removerAluno(mockStudent);

      expect(prisma.usuarios.delete).toHaveBeenCalledWith({
        where: { id: Number(mockStudent.id) },
      });
      expect(result).toEqual(mockStudent);
    });
  });

  describe("cadastrarAluno", () => {
    it("should create a new student", async () => {
      const mockStudent = {
        nome: "New Student",
        turma: "A",
        turmap: 1,
        matricula: "123",
      };

      const mockCreatedStudent = { ...mockStudent, id: 1, perfil: 2 };

      prisma.usuarios.create.mockResolvedValue(mockCreatedStudent);

      const result = await ProfessorRepository.cadastrarAluno(mockStudent);

      expect(prisma.usuarios.create).toHaveBeenCalledWith({
        data: {
          nome: mockStudent.nome,
          turma: mockStudent.turma,
          turmap: Number(mockStudent.turmap),
          senha: mockStudent.matricula,
          matricula: mockStudent.matricula,
          perfil: 2,
        },
      });
      expect(result).toEqual(mockCreatedStudent);
    });
  });

  describe("cargaAluno", () => {
    it("should bulk insert students", async () => {
      const mockStudents = [
        {
          nome: "Student 1",
          matricula: "123",
          turma: "A",
          turmap: 1,
          perfil: 2,
          senha: "123",
        },
        {
          nome: "Student 2",
          matricula: "456",
          turma: "B",
          turmap: 2,
          perfil: 2,
          senha: "456",
        },
      ];

      prisma.usuarios.createMany.mockResolvedValue({ count: 2 });

      const result = await ProfessorRepository.cargaAluno(mockStudents);

      expect(prisma.usuarios.createMany).toHaveBeenCalledWith({
        data: mockStudents,
        skipDuplicates: true,
      });
      expect(result).toEqual({ count: 2 });
    });
  });
});
