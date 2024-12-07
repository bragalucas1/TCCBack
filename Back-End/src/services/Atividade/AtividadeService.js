const path = require("path");
const fs = require("fs").promises;
const AtividadeRepository = require("../../repository/Atividade/AtividadeRepository");
const ArquivoService = require("../Arquivo/ArquivoService");

const AtividadeService = {
  listarAtividades: async (userId) => {
    try {
      const atividades = await AtividadeRepository.listarAtividades(userId);
      const atividadesProcessadas = await Promise.all(
        atividades.map(async (atividade) => {
          const dataFormatada = atividade.data_limite
            ? new Date(atividade.data_limite).toISOString().slice(0, 16)
            : "";

          if (atividade.submissoes.length > 0) {
            const submissoesProcessadas =
              await ArquivoService.processasSubmissoes(atividade.submissoes);
            return {
              ...atividade,
              data_limite: dataFormatada,
              submissoes: submissoesProcessadas,
            };
          }
          return { ...atividade, data_limite: dataFormatada };
        })
      );

      return atividadesProcessadas;
    } catch (error) {
      throw new Error("Erro ao listar atividades no Banco: " + error.message);
    }
  },
  listarAtividadesTeacher: async () => {
    try {
      const atividades = await AtividadeRepository.listarAtividades();
      const atividadesProcessadas = await Promise.all(
        atividades.map(async (atividade) => {
          // Formata a data para o padrão do input datetime-local
          const dataFormatada = atividade.data_limite
            ? new Date(atividade.data_limite).toISOString().slice(0, 16)
            : "";

          if (atividade.submissoes.length > 0) {
            const submissoesProcessadas =
              await ArquivoService.processasSubmissoes(atividade.submissoes);
            return {
              ...atividade,
              data_limite: dataFormatada,
              submissoes: submissoesProcessadas,
            };
          }
          return { ...atividade, data_limite: dataFormatada };
        })
      );

      return atividadesProcessadas;
    } catch (error) {
      throw new Error("Erro ao listar atividades no Banco: " + error.message);
    }
  },
  salvarDadosAtividade: async (atividadeData) => {
    try {
      const { nome, tipo, conteudo, dataLimite, arquivos } = atividadeData;
      const arquivoFonteBase = arquivos.caminho_codigo_base[0].path;
      const pdfFile = arquivos.caminho_pdf[0].path;

      await AtividadeRepository.salvarAtividade(
        nome,
        tipo,
        conteudo,
        dataLimite,
        arquivoFonteBase,
        pdfFile
      );
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao salvar atividade no Banco: " + error.message);
    }
  },
  removerAtividade: async (id) => {
    try {
      const atividades = await AtividadeRepository.removerAtividade(id);
      return atividades;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao remover atividade no Banco: " + error.message);
    }
  },
  removerDiretorioAtividade: async (nomeAtividade) => {
    try {
      const baseUploadDir = path.join(__dirname, "..", "..", "..", "uploads");
      const diretorioAtividade = path.join(baseUploadDir, nomeAtividade);

      try {
        await fs.access(diretorioAtividade);
      } catch (error) {
        console.log(`Diretório não encontrado: ${diretorioAtividade}`);
        return;
      }

      const arquivos = await fs.readdir(diretorioAtividade);

      for (const arquivo of arquivos) {
        const caminhoArquivo = path.join(diretorioAtividade, arquivo);
        try {
          await fs.unlink(caminhoArquivo);
          // console.log(`Arquivo removido: ${caminhoArquivo}`);
        } catch (error) {
          console.error(`Erro ao remover arquivo ${caminhoArquivo}:`, error);
          throw new Error(`Falha ao remover arquivo: ${arquivo}`);
        }
      }

      try {
        await fs.rmdir(diretorioAtividade);
        // console.log(`Diretório removido: ${diretorioAtividade}`);
      } catch (error) {
        console.error(
          `Erro ao remover diretório ${diretorioAtividade}:`,
          error
        );
        try {
          await fs.rm(diretorioAtividade, { recursive: true, force: true });
          // console.log(`Diretório removido forçadamente: ${diretorioAtividade}`);
        } catch (finalError) {
          console.error(
            `Falha total ao remover diretório ${diretorioAtividade}:`,
            finalError
          );
          throw new Error(
            `Falha ao remover diretório da atividade: ${nomeAtividade}`
          );
        }
      }

      return true;
    } catch (error) {
      console.error("Erro ao deletar arquivos da atividade:", error);
      throw error;
    }
  },
  editarAtividade: async (atividadeData) => {
    try {
      const atividade = await AtividadeRepository.editarAtividade(
        atividadeData
      );
      return atividade;
    } catch (error) {
      throw new Error("Erro ao editar atividade no Banco: " + error.message);
    }
  },
  buscarAtividadePorId: async (id) => {
    try {
      const atividade = await AtividadeRepository.buscarAtividadePorId(
        Number(id)
      );
      return atividade;
    } catch (error) {
      console.log(error);
      throw new Error("Erro ao buscar atividade por id: " + error.message);
    }
  },
  editarAtividadeExistente: async (atividadeData) => {
    const { id, nome, tipo, dataLimite, conteudo, arquivos } = atividadeData;
    const baseUploadDir = path.join(__dirname, "..", "..", "uploads");
    const atividadeAtual = await AtividadeService.buscarAtividadePorId(
      atividadeData.id
    );

    if (!atividadeAtual) {
      return res.status(404).json({ error: "Atividade não encontrada." });
    }

    let dadosAtualizacao = {
      id,
      nome: nome || atividadeAtual.nome,
      tipo: tipo || atividadeAtual.tipo,
      conteudo: conteudo || atividadeAtual.conteudo,
      caminho_pdf: atividadeAtual.caminho_pdf, // Mantém o caminho existente
      caminho_codigo_base: atividadeAtual.caminho_codigo_base, // Mantém o caminho existente
      data_limite: dataLimite || atividadeAtual.data_limite,
    };

    if (nome && nome !== atividadeAtual.nome) {
      const antigaPasta = path.join(baseUploadDir, atividadeAtual.nome);
      const novaPasta = path.join(baseUploadDir, novoNome);

      // Verificar se a pasta antiga existe
      try {
        const pastaAntigaExiste = await fs
          .access(antigaPasta)
          .then(() => true)
          .catch(() => false);

        if (pastaAntigaExiste) {
          // Criar nova pasta se não existir
          await fs.mkdir(novaPasta, { recursive: true });

          // Mover todos os arquivos da pasta antiga para a nova
          const arquivos = await fs.readdir(antigaPasta);
          for (const arquivo of arquivos) {
            const caminhoAntigo = path.join(antigaPasta, arquivo);
            const caminhoNovo = path.join(novaPasta, arquivo);
            await fs.rename(caminhoAntigo, caminhoNovo);

            // Atualizar caminhos no objeto de atualização
            if (
              atividadeAtual.caminho_pdf &&
              atividadeAtual.caminho_pdf.includes(arquivo)
            ) {
              dadosAtualizacao.caminho_pdf = caminhoNovo;
            }
            if (
              atividadeAtual.caminho_codigo_base &&
              atividadeAtual.caminho_codigo_base.includes(arquivo)
            ) {
              dadosAtualizacao.caminho_codigo_base = caminhoNovo;
            }
          }

          // Remover pasta antiga após mover todos os arquivos
          await fs.rmdir(antigaPasta);
        }
      } catch (error) {
        console.error("Erro ao gerenciar pastas:", error);
      }
    }

    // Se foram enviados novos arquivos (o Multer já salvou eles)
    if (arquivos) {
      // Se tem novo PDF
      if (arquivos.caminho_pdf) {
        if (atividadeAtual.caminho_pdf) {
          try {
            await fs.unlink(atividadeAtual.caminho_pdf);
          } catch (error) {
            console.log("Erro ao remover PDF antigo:", error);
          }
        }
        dadosAtualizacao.caminho_pdf = arquivos.caminho_pdf[0].path;
      }

      // Se tem novo código base
      if (arquivos.caminho_codigo_base) {
        // Remover código base antigo se existir
        if (atividadeAtual.caminho_codigo_base) {
          try {
            await fs.unlink(atividadeAtual.caminho_codigo_base);
          } catch (error) {
            console.log("Erro ao remover código base antigo:", error);
          }
        }
        dadosAtualizacao.caminho_codigo_base =
          arquivos.caminho_codigo_base[0].path;
      }
    }
    console.log("final", dadosAtualizacao);
    return await AtividadeService.editarAtividade(dadosAtualizacao);
  },
  obterPdfAtiviade: async (activityName) => {
    try {
      console.log("entrei aq");
      const uploadsPath = path.join(
        __dirname,
        "../../../uploads",
        activityName
      );

      // Log para debug
      console.log("Caminho da atividade:", uploadsPath);
      try {
        await fs.access(uploadsPath);
      } catch (error) {
        throw new Error(`Diretório não encontrado: ${uploadsPath}`);
      }
      const files = await fs.readdir(uploadsPath);
      console.log("Arquivos encontrados:", files);
      const pdfFile = files.find((file) => file.toLowerCase().endsWith(".pdf"));
      console.log("pdfFile", pdfFile);

      if (!pdfFile) {
        throw new Error("PDF não encontrado");
      }

      const pdfPath = path.join(uploadsPath, pdfFile);
      return pdfPath;
    } catch (error) {
      throw new Error("Erro ao obter pdf da atividade:" + error.message);
    }
  },
};

module.exports = AtividadeService;
