const zlib = require("zlib");
const fs = require("fs").promises;
const util = require("util");
const gzip = util.promisify(zlib.gzip);
const gunzip = util.promisify(zlib.gunzip);

const ArquivoService = {
  comprimirArquivo: async (caminhoArquivo) => {
    try {
      const arquivo = await fs.readFile(caminhoArquivo);
      const arquivoComprimido = await gzip(arquivo);
      return arquivoComprimido;
    } catch (error) {
      throw new Error("Erro ao comprimir arquivo: " + error.message);
    }
  },

  descomprimirArquivo: async (caminhoArquivo) => {
    try {
      const arquivoComprimido = await fs.readFile(caminhoArquivo);
      const arquivoDescomprimido = zlib
        .gunzipSync(arquivoComprimido)
        .toString("utf-8");
      return arquivoDescomprimido;
    } catch (error) {
      throw new Error("Erro ao descomprimir arquivo: " + error.message);
    }
  },
  processasSubmissoes: async (submissoes) => {
    return await Promise.all(
      submissoes.map(async (submissao) => {
        if (submissao.codigo_comprimido) {
          try {
            const codigoDescomprimido = await gunzip(
              submissao.codigo_comprimido
            );
            return {
              ...submissao,
              codigo: codigoDescomprimido.toString("utf8"),
            };
          } catch (error) {
            console.error(
              `Erro ao descomprimir código da submissão ${submissao.id}:`,
              error
            );
            return submissao;
          }
        }
        return submissao;
      })
    );
  },
};

module.exports = ArquivoService;
