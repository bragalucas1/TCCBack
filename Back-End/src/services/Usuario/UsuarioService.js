// src/services/usuarioService.js
const UsuarioRepository = require("../../repository/Usuario/UsuarioRepository");

const UsuarioService = {
  getAllUsers: async () => {
    try {
      const users = await UsuarioRepository.findMany();
      return users;
    } catch (error) {
      throw new Error("Erro ao buscar usuários: " + error.message);
    }
  },
  verificaCredenciais: async (matricula, senha) => {
    try {
      const user = await UsuarioRepository.findByMatriculaAndSenha(
        matricula,
        senha
      );
      console.log(user);
      return user;
    } catch (error) {
      throw new Error("Erro ao verificar credenciais: " + error.message);
    }
  },
  findByIds: async (ids) => {
    try {
      const user = await UsuarioRepository.findByIds(ids);
      return user;
    } catch (error) {
      throw new Error("Erro ao buscar usuário por id: " + error.message);
    }
  },
};

module.exports = UsuarioService;
