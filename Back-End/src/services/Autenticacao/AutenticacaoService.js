// src/services/usuarioService.js
const UsuarioRepository = require("../../repository/Usuario/UsuarioRepository");

const AutenticacaoService = {
    verificaCredenciais: async (matricula, senha) => {
        try {
            const user = await UsuarioRepository.findByMatriculaAndSenha(matricula, senha);
            if (!user){
                throw new Error("Credenciais inválidas");
            }
            return user;
        } catch (error) {
            throw new Error("Erro ao verificar credenciais: " + error.message);
        }
    }
};

module.exports = AutenticacaoService;