import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export class Conexao {

    protected static pool: Pool;

    static async query<T extends any>(text: string, params?: any[]): Promise<T[]> {
        if (!Conexao.pool) {
            Conexao.pool = new Pool({
                user: process.env.DB_USER,
                host: process.env.DB_HOST,
                database: process.env.DB_NAME,
                password: process.env.DB_PASSWORD,
                port: parseInt(process.env.DB_PORT || '5432'),
            });

            Conexao.pool.on('error', (err) => console.error('Erro no pool de conexões:', err));
        }

        const client = await Conexao.pool.connect();
        try {
            const result = await client.query(text, params);
            return result.rows;
        } catch (err) {
            console.error('Erro na query:', err);
            throw err;
        } finally {
            client.release();
        }
    }
}
