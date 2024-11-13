// database/prismaClient.js
require('dotenv').config(); // Certifique-se de que isso está aqu

const { PrismaClient } = require('@prisma/client'); // Importa PrismaClient com CommonJS
const prisma = new PrismaClient();

module.exports = prisma; // Exporta a instância do PrismaClient
