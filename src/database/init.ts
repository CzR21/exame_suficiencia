import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const defaultPool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: 'postgres', // banco padrão
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432'),
});

const createTableSQL = `
  CREATE TABLE IF NOT EXISTS feedbacks (
    id SERIAL PRIMARY KEY,
    titulo TEXT NOT NULL,
    descricao TEXT NOT NULL,
    tipo TEXT CHECK (tipo IN ('bug', 'sugestão', 'reclamação', 'feedback')) NOT NULL,
    status TEXT CHECK (status IN ('recebido', 'em análise', 'em desenvolvimento', 'finalizado')) NOT NULL DEFAULT 'recebido',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

export async function initializeDatabase() {
  const dbName = process.env.DB_NAME;

  try {
    const result = await defaultPool.query(`SELECT 1 FROM pg_database WHERE datname = $1`, [dbName]);

    if (result.rowCount === 0) {
      await defaultPool.query(`CREATE DATABASE "${dbName}"`);
      console.log(`Banco de dados '${dbName}' criado com sucesso.`);
    } else {
      console.log(`Banco de dados '${dbName}' já existe.`);
    }

    await defaultPool.end();

    const dbPool = new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: dbName,
      password: process.env.DB_PASSWORD,
      port: parseInt(process.env.DB_PORT || '5432'),
    });

    await dbPool.query(createTableSQL);
    console.log('Tabela "feedbacks" criada com sucesso (ou já existia).');

    await dbPool.end();

  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    process.exit(1);
  }
}