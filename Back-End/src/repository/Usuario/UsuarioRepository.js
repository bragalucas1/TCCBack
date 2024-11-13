const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

const UsuarioRepository = {
    findMany: async () => {
        return await prisma.usuarios.findMany(); 
    },
    findByMatriculaAndSenha: async (matricula, senha) => {
        return await prisma.usuarios.findFirst({
            where: {
                matricula: matricula,
                senha: senha
            }
        });
    },
    findByIds: async (ids) => {
        return await prisma.usuarios.findMany({
            where: {
                id: {
                    in: ids
                }
            }
        });
    }
};

module.exports = UsuarioRepository; // Exporta o repositório
