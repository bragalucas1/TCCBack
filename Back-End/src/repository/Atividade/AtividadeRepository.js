const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const AtividadeRepository = {
  salvarAtividade: async (
    title,
    type,
    content,
    dataLimite,
    arquivoFonteBase,
    pdfFile,
    arquivoEntrada
  ) => {
    return await prisma.atividades.create({
      data: {
        nome: title,
        tipo: type,
        conteudo: content,
        data_limite: new Date(
          new Date(dataLimite).getTime() -
            new Date().getTimezoneOffset() * 60000
        ).toISOString(),
        caminho_pdf: pdfFile,
        caminho_codigo_base: arquivoFonteBase,
        caminho_codigo_verificacao: arquivoEntrada ?? null,
        possui_verificacao: arquivoEntrada ? true : false,
      },
    });
  },
  listarAtividades: async (userId) => {
    return await prisma.atividades.findMany({
      select: {
        id: true,
        nome: true,
        tipo: true,
        conteudo: true,
        caminho_pdf: true,
        caminho_codigo_base: true,
        submissoes: true,
        data_limite: true,
        possui_verificacao: true,
        caminho_codigo_verificacao: true,
      },
    });
  },
  removerAtividade: async (id) => {
    return await prisma.atividades.delete({
      where: {
        id: id,
      },
    });
  },
  buscarAtividadePorId: async (id) => {
    return await prisma.atividades.findUnique({
      where: {
        id: id,
      },
      include: {
        submissoes: {
          orderBy: {
            data_submissao: "desc", 
          },
        },
      },
    });
  },
  editarAtividade: async (atividade) => {
    return await prisma.atividades.update({
      where: {
        id: Number(atividade.id),
      },
      data: {
        nome: atividade.nome,
        tipo: atividade.tipo,
        conteudo: atividade.conteudo,
        caminho_pdf: atividade.caminho_pdf,
        caminho_codigo_base: atividade.caminho_codigo_base,
        data_limite: new Date(atividade.data_limite).toISOString(),
        possui_verificacao: atividade.possui_verificacao,
        caminho_codigo_verificacao: atividade.caminho_codigo_verificacao,
      },
    });
  },
  listarAtividadePeloId: async (id) => {
    return await prisma.atividades.findUnique({
      where: {
        id: Number(id),
      },
    });
  },
};

module.exports = AtividadeRepository;
