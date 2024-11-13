const { spawn } = require("child_process");
const AtividadeService = require("../Atividade/AtividadeService");
const CorrecaoRepository = require("../../repository/Correcao/CorrecaoRepository");
const ArquivoService = require("../Arquivo/ArquivoService");

const CorrecaoService = {
  fluxoDeCorrecao: async (file, userId, userName, activityId) => {
    try {
      const arquivoAluno = file.path;
      const atividadeBase = await AtividadeService.buscarAtividadePorId(
        Number(activityId)
      );

      const conteudoArquivoComprimido = await ArquivoService.comprimirArquivo(
        file.path
      );

      const saidaAluno = await CorrecaoService.executaPython(arquivoAluno);
      const saidaBase = await CorrecaoService.executaPython(
        atividadeBase.caminho_codigo_base
      );

      const resultado = {
        correto: saidaAluno === saidaBase,
        saidaAluno: saidaAluno,
        saidaEsperada: saidaBase,
      };

      await CorrecaoService.atualizarSubmissao(
        userId,
        userName,
        activityId,
        resultado.correto ? "Correto" : "Incorreto",
        conteudoArquivoComprimido
      );

      return resultado;
    } catch (error) {
      console.error("Erro no fluxo de correção:", error);
      throw error;
    }
  },
  executaPython: (arquivoPath) => {
    return new Promise((resolve, reject) => {
      let saida = "";
      let erro = "";

      const processo = spawn("python", [arquivoPath]);

      processo.stdout.on("data", (data) => {
        saida += data.toString();
      });

      processo.stderr.on("data", (data) => {
        erro += data.toString();
      });

      processo.on("close", (code) => {
        if (code !== 0) {
          reject(new Error(`Erro ao executar Python: ${erro}`));
        } else {
          resolve(saida.trim());
        }
      });
    });
  },
  atualizarSubmissao: async (
    userId,
    userName,
    activityId,
    status,
    conteudoArquivoComprimido
  ) => {
    try {
      await CorrecaoRepository.atualizarSubmissao(
        Number(userId),
        userName,
        Number(activityId),
        status,
        conteudoArquivoComprimido
      );
    } catch (error) {
      console.error("Erro ao atualizar submissão:", error);
      throw error;
    }
  },
};

module.exports = CorrecaoService;
