const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const AtividadeRepository = {
  salvarAtividade: async (title, type, content, arquivoFonteBase, pdfFile) => {
    return await prisma.atividades.create({
      data: {
        nome: title,
        tipo: type,
        conteudo: content,
        caminho_pdf: pdfFile,
        caminho_codigo_base: arquivoFonteBase,
      },
    });
  },
  listarAtividades: async () => {
    return await prisma.atividades.findMany({
      select: {
        id: true,
        nome: true,
        tipo: true,
        conteudo: true,
        caminho_pdf: true,
        caminho_codigo_base: true,
        submissoes: true, 
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
