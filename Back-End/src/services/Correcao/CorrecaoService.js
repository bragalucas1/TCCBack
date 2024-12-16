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

      if (!saidaAluno.sucesso) {
        const resultado = {
          correto: false,
          erro: true,
          detalhesErro: saidaAluno.erro,
          saidaAluno: saidaAluno.mensagem,
          saidaEsperada: saidaBase.sucesso ? saidaBase.dados : null,
        };

        await CorrecaoService.atualizarSubmissao(
          userId,
          userName,
          activityId,
          "Erro",
          conteudoArquivoComprimido
        );

        return resultado;
      }

      const resultado = {
        correto: saidaAluno.dados === saidaBase.dados,
        erro: false,
        detalhesErro: null,
        saidaAluno: saidaAluno.dados,
        saidaEsperada: saidaBase.dados,
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
    return new Promise((resolve) => {
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
          const resultado = {
            sucesso: false,
            codigo: code,
            erro: CorrecaoService.mapearErroPython(erro),
            mensagem: erro,
          };
          resolve(resultado);
        } else {
          resolve({
            sucesso: true,
            codigo: code,
            dados: saida.trim(),
            erro: null,
          });
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
  mapearErroPython: (erro) => {
    const linhaMatch = erro.match(/line (\d+)/);
    const numeroLinha = linhaMatch ? linhaMatch[1] : "desconhecida";

    if (erro.includes("IndentationError")) {
      return {
        tipo: "ERRO_INDENTACAO",
        descricao: `Linha ${numeroLinha}: Erro de indentação no código Python. 
                   Tradução: A indentação (espaços no início da linha) está incorreta.
                   Solução: Verifique se todos os blocos de código estão alinhados corretamente com 4 espaços ou 1 tab.`,
      };
    }
    if (erro.includes("SyntaxError")) {
      if (erro.includes("was never closed")) {
        return {
          tipo: "ERRO_SINTAXE_PARENTESES",
          descricao: `Linha ${numeroLinha}: Parêntese não foi fechado.
                     Tradução: Um parêntese aberto '(' não possui seu par fechado ')'.
                     Solução: Adicione o parêntese que está faltando para fechar a expressão.`,
        };
      }
      return {
        tipo: "ERRO_SINTAXE",
        descricao: `Linha ${numeroLinha}: Erro de sintaxe no código Python.
                   Tradução: A estrutura do código está escrita de forma incorreta.
                   Solução: Verifique a sintaxe da linha, procurando por parênteses, vírgulas ou outros símbolos que possam estar faltando.`,
      };
    }
    if (erro.includes("NameError")) {
      return {
        tipo: "ERRO_VARIAVEL",
        descricao: `Linha ${numeroLinha}: Variável não definida.
                   Tradução: Tentativa de usar uma variável que não foi criada.
                   Solução: Certifique-se de que a variável foi declarada antes de ser utilizada.`,
      };
    }
    if (erro.includes("ZeroDivisionError")) {
      return {
        tipo: "ERRO_DIVISAO_ZERO",
        descricao: `Linha ${numeroLinha}: Tentativa de divisão por zero.
                   Tradução: O código tentou realizar uma divisão onde o divisor é zero.
                   Solução: Adicione uma verificação para garantir que o divisor não seja zero antes de realizar a divisão.`,
      };
    }
    if (erro.includes("FileNotFoundError")) {
    return {
        tipo: "ERRO_ARQUIVO",
        descricao: `Linha ${numeroLinha}: Arquivo não encontrado.
                   Tradução: O programa tentou acessar um arquivo que não existe no caminho especificado.
                   Solução: Verifique se o nome e o caminho do arquivo estão corretos e se ele existe no local indicado.`,
      };
    }
    if (erro.includes("ImportError") || erro.includes("ModuleNotFoundError")) {
      return {
        tipo: "ERRO_IMPORTACAO",
        descricao: `Linha ${numeroLinha}: Erro ao importar módulo.
                   Tradução: Não foi possível importar um módulo ou biblioteca necessária.
                   Solução: Verifique se o módulo está instalado corretamente usando pip install ou se o nome está escrito corretamente.`,
      };
    }
    if (erro.includes("ValueError")) {
      return {
        tipo: "ERRO_VALOR",
        descricao: `Linha ${numeroLinha}: Valor inválido fornecido.
                   Tradução: O programa recebeu um valor que não pode ser processado da forma esperada.
                   Solução: Verifique se os valores fornecidos são do tipo correto e estão no formato esperado.`,
      };
    }
    if (erro.includes("TypeError")) {
      return {
        tipo: "ERRO_TIPO",
        descricao: `Linha ${numeroLinha}: Tipo de dado incompatível.
                   Tradução: Tentativa de operação entre tipos de dados incompatíveis.
                   Solução: Verifique se os tipos de dados das variáveis são compatíveis com a operação que está tentando realizar.`,
      };
    }

    return {
      tipo: "ERRO_DESCONHECIDO",
      descricao: `Linha ${numeroLinha}: Erro não identificado na execução.
                 Tradução: Ocorreu um erro que não se encaixa nos padrões conhecidos.
                 Solução: Analise a mensagem de erro completa e verifique a lógica do código nesta linha.`,
    };
  },
};

module.exports = CorrecaoService;
