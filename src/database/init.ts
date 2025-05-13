import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
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
  try {
    await pool.query(createTableSQL);
  } catch (error) {
    console.error('Erro ao criar tabela:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}
