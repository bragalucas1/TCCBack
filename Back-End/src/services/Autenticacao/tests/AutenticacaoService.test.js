const UsuarioRepository = require("../../../repository/Usuario/UsuarioRepository");
const AutenticacaoService = require("../AutenticacaoService");

jest.mock("../../../repository/Usuario/UsuarioRepository");

describe("AutenticacaoService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("verificaCredenciais", () => {
    it("deve retornar o usuário se as credenciais forem válidas", async () => {
      const mockUser = { id: 1, matricula: "12345", nome: "Usuário Teste" };

      UsuarioRepository.findByMatriculaAndSenha.mockResolvedValue(mockUser);

      const result = await AutenticacaoService.verificaCredenciais(
        "12345",
        "senha123"
      );

      expect(result).toEqual(mockUser);
      expect(UsuarioRepository.findByMatriculaAndSenha).toHaveBeenCalledWith(
        "12345",
        "senha123"
      );
    });

    it("deve lançar um erro se as credenciais forem inválidas", async () => {
      UsuarioRepository.findByMatriculaAndSenha.mockResolvedValue(null);

      await expect(
        AutenticacaoService.verificaCredenciais("12345", "senha123")
      ).rejects.toThrow("Credenciais inválidas");

      expect(UsuarioRepository.findByMatriculaAndSenha).toHaveBeenCalledWith(
        "12345",
        "senha123"
      );
    });

    it("deve lançar um erro ao ocorrer uma falha no repositório", async () => {
      UsuarioRepository.findByMatriculaAndSenha.mockRejectedValue(
        new Error("Erro no banco de dados")
      );

      await expect(
        AutenticacaoService.verificaCredenciais("12345", "senha123")
      ).rejects.toThrow(
        "Erro ao verificar credenciais: Erro no banco de dados"
      );

      expect(UsuarioRepository.findByMatriculaAndSenha).toHaveBeenCalledWith(
        "12345",
        "senha123"
      );
    });
  });
});
