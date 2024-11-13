const UsuarioService = require("../../services/Usuario/UsuarioService");

const UsuarioController = {
  getUsers: async (req, res) => {
    try {
      const users = await UsuarioService.getAllUsers();
      return res.status(200).json(users);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },
  listById: async (req, res) => {
    try {
      const { ids } = req.body;
      const user = await UsuarioService.findByIds(ids);
      return res.status(200).json(user);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: error.message });
    }
  },
};

module.exports = UsuarioController;
