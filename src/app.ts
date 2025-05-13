import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import dotenv from 'dotenv';
import rotas from './routes/rotas';
import { initializeDatabase } from './database/init';
import { verificarAutenticacao } from './middlewares/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(verificarAutenticacao);
app.use(rotas);

initializeDatabase();

app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));