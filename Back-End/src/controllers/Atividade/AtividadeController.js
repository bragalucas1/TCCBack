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
      const atividades = await AtividadeService.listarAtividades();
      res.status(200).json({ success: true, atividades });
    } catch (error) {
      console.log(error);
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
};

module.exports = AtividadeController;
