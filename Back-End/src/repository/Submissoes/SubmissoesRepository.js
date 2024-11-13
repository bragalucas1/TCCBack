const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const SubmissoesRepository = {
  removeSubmition: async (id) => {
    return await prisma.submissoes.delete({
      where: {
        id: id,
      },
    });
  },
};

module.exports = SubmissoesRepository;
