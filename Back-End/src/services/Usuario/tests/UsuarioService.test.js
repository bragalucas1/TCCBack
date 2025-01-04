const UsuarioRepository = require("../../../repository/Usuario/UsuarioRepository");
const UsuarioService = require("../UsuarioService");

jest.mock("../../../repository/Usuario/UsuarioRepository");

describe("UsuarioService", () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Limpa os mocks antes de cada teste
  });

  describe("getAllUsers", () => {
    it("deve retornar todos os usuários", async () => {
      const mockUsers = [
        { id: 1, nome: "Usuário 1" },
        { id: 2, nome: "Usuário 2" },
      ];
      UsuarioRepository.findMany.mockResolvedValue(mockUsers);

      const result = await UsuarioService.getAllUsers();

      expect(result).toEqual(mockUsers);
      expect(UsuarioRepository.findMany).toHaveBeenCalled();
    });

    it("deve lançar um erro se falhar ao buscar usuários", async () => {
      UsuarioRepository.findMany.mockRejectedValue(
        new Error("Erro no banco de dados")
      );

      await expect(UsuarioService.getAllUsers()).rejects.toThrow(
        "Erro ao buscar usuários: Erro no banco de dados"
      );
    });
  });

  describe("verificaCredenciais", () => {
    it("deve retornar o usuário se as credenciais forem válidas", async () => {
      const mockUser = { id: 1, matricula: "12345", nome: "Usuário Teste" };
      UsuarioRepository.findByMatriculaAndSenha.mockResolvedValue(mockUser);

      const result = await UsuarioService.verificaCredenciais(
        "12345",
        "senha123"
      );

      expect(result).toEqual(mockUser);
      expect(UsuarioRepository.findByMatriculaAndSenha).toHaveBeenCalledWith(
        "12345",
        "senha123"
      );
    });

    it("deve lançar um erro se falhar ao verificar credenciais", async () => {
      UsuarioRepository.findByMatriculaAndSenha.mockRejectedValue(
        new Error("Erro no banco de dados")
      );

      await expect(
        UsuarioService.verificaCredenciais("12345", "senha123")
      ).rejects.toThrow(
        "Erro ao verificar credenciais: Erro no banco de dados"
      );
    });
  });

  describe("findByIds", () => {
    it("deve retornar o usuário correspondente aos IDs", async () => {
      const mockUsers = [
        { id: 1, nome: "Usuário 1" },
        { id: 2, nome: "Usuário 2" },
      ];
      UsuarioRepository.findByIds.mockResolvedValue(mockUsers);

      const result = await UsuarioService.findByIds([1, 2]);

      expect(result).toEqual(mockUsers);
      expect(UsuarioRepository.findByIds).toHaveBeenCalledWith([1, 2]);
    });

    it("deve lançar um erro se falhar ao buscar usuários por ID", async () => {
      UsuarioRepository.findByIds.mockRejectedValue(
        new Error("Erro no banco de dados")
      );

      await expect(UsuarioService.findByIds([1, 2])).rejects.toThrow(
        "Erro ao buscar usuário por id: Erro no banco de dados"
      );
    });
  });
});
