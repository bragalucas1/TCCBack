const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const ProfessorRepository = {
  listarAlunos: async () => {
    return await prisma.usuarios.findMany({
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
  },
  editarAluno: async (aluno) => {
    console.log("aluno", aluno);
    return await prisma.usuarios.update({
      where: {
        id: aluno.id,
      },
      data: {
        nome: aluno.nome,
        turma: aluno.turma,
        turmap: aluno.turmap,
        matricula: aluno.matricula,
      },
    });
  },
  removerAluno: async (aluno) => {
    return await prisma.usuarios.delete({
      where: {
        id: Number(aluno.id),
      },
    });
  },
  cadastrarAluno: async (aluno) => {
    return await prisma.usuarios.create({
      data: {
        nome: aluno.nome,
        turma: aluno.turma,
        turmap: Number(aluno.turmap),
        senha: aluno.matricula,
        matricula: aluno.matricula,
        perfil: 2,
      },
    });
  },
  cargaAluno: async (alunos) => {
    return await prisma.usuarios.createMany({
      data: alunos,
      skipDuplicates: true,
    });
  },
};

module.exports = ProfessorRepository;
