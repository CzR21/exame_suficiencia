import http from 'http';
import { rotas } from './routes/rotas';
import dotenv from 'dotenv';
import { initializeDatabase } from './database/init';

dotenv.config();

const PORT = process.env.PORT || 3000;

initializeDatabase();

const server = http.createServer((req, res) => {
  rotas(req, res);
});

server.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));