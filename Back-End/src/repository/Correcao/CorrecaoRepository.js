const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const CorrecaoRepository = {
  atualizarSubmissao: async (
    userId,
    userName,
    activityId,
    status,
    conteudoArquivoComprimido
  ) => {
    return await prisma.submissoes.upsert({
      where: {
        usuario_id_atividade_id: {
          usuario_id: userId,
          atividade_id: activityId,
        },
      },
      update: {
        status: status,
        quantidade_sub: {
          increment: 1,
        },
        codigo_comprimido: conteudoArquivoComprimido,
      },
      create: {
        usuario_id: userId,
        nome_usuario: userName,
        atividade_id: activityId,
        status: status,
        quantidade_sub: 1,
        codigo_comprimido: conteudoArquivoComprimido,
      },
    });
  },
};

module.exports = CorrecaoRepository;
