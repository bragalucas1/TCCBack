const AtividadeService = require("../../services/Atividade/AtividadeService");

const AtividadeController = {
  salvarDadosAtividade: async (req, res) => {
    try {
      const { nome, tipo, conteudo } = req.body;
      const arquivos = req.files;
      const atividadeData = { nome, tipo, conteudo, arquivos };
      await AtividadeService.salvarDadosAtividade(atividadeData);

      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao cadastro da atividade." });
    }
  },
  listarAtividades: async (req, res) => {
    try {
      const userId = req.query.userId;
      const atividades = await AtividadeService.listarAtividades(userId);
      res.status(200).json({ success: true, atividades });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao listar atividades." });
    }
  },
  listarAtividadesTeacher: async (req, res) => {
    try {
      const atividades = await AtividadeService.listarAtividadesTeacher();
      res.status(200).json({ success: true, atividades });
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar atividades." });
    }
  },
  deletarAtividade: async (req, res) => {
    try {
      const { activityName, id } = req.body;
      await AtividadeService.removerAtividade(id);
      await AtividadeService.removerDiretorioAtividade(activityName);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao deletar atividade." });
    }
  },
  editarAtividade: async (req, res) => {
    try {
      const { id, nome, tipo, conteudo } = req.body;
      const atividadeData = {
        id,
        nome,
        tipo,
        conteudo,
        arquivos: req.files,
      };
      await AtividadeService.editarAtividadeExistente(atividadeData);
      res.status(200).json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Erro ao editar atividade." });
    }
  },
  listarAtividadePorId: async (req, res) => {
    try {
      const { id } = req.body;
      const result = await AtividadeService.buscarAtividadePorId(id);
      res.status(200).json({ success: true, atividade: result });
    } catch (error) {
      res.status(500).json({ error: "Erro ao listar atividade pelo id." });
    }
  },
  obterPdfAtiviade: async (req, res) => {
    try {
      console.log("aqui");
      const pdfPath = await AtividadeService.obterPdfAtiviade(
        req.query.activityName
      );
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline; filename=file.pdf");
      res.sendFile(pdfPath, (err) => {
        if (err) {
          console.error("Erro ao enviar arquivo:", err);
          // Only send error response if headers haven't been sent
          if (!res.headersSent) {
            res.status(500).json({ error: "Erro ao enviar o arquivo PDF" });
          }
        }
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Erro ao obter pdf da atividade." });
    }
  },
};

module.exports = AtividadeController;
