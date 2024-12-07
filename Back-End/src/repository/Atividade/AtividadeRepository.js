const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const AtividadeRepository = {
  salvarAtividade: async (
    title,
    type,
    content,
    dataLimite,
    arquivoFonteBase,
    pdfFile
  ) => {
    return await prisma.atividades.create({
      data: {
        nome: title,
        tipo: type,
        conteudo: content,
        data_limite: new Date(dataLimite).toISOString(),
        caminho_pdf: pdfFile,
        caminho_codigo_base: arquivoFonteBase,
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
            data_submissao: "desc", // Ordena do mais recente para o mais antigo
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
