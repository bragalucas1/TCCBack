const AutenticacaoService = require('../../services/Autenticacao/AutenticacaoService');

const AutenticacaoController = {
    login: async (req, res) => {
        try {
            const { matricula, senha } = req.body;
            const user = await AutenticacaoService.verificaCredenciais(matricula, senha);
            res.status(200).json({ success: true, user: user });
        } catch (error) {
            res.status(500).json({ error: 'Erro ao realizar o login' });
        }
    },
};

module.exports = AutenticacaoController;