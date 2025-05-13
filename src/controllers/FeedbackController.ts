import { IncomingMessage, ServerResponse } from 'http';
import { FeedbackService } from '../services/FeedbackService';
import { TipoFeedback,  } from '../models/Feedback';
import { parse as parseBody } from 'querystring';
import { renderFile } from 'ejs';
import path from 'path';
import { URL } from 'url';
import { asStatusFeedback, asTipoFeedback } from '../helpers/EnumHelper';

export class FeedbackController {
    private service = new FeedbackService();

    async index(req: IncomingMessage, res: ServerResponse) {
        try {
            const feedbacks = await this.service.listarFeedbacks();
            renderFile(path.join(__dirname, '../views/feedbacks_view.ejs'), { feedbacks }, (err: any, html: any) => {
                if (err) return this.renderError(res, 'Erro ao renderizar feedbacks', err.message);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            });
        } catch (error) {
            this.renderError(res, 'Erro ao listar feedbacks', 'Tente novamente mais tarde.');
        }
    }

    async show(req: IncomingMessage, res: ServerResponse) {
        try {
            const idMatch = req.url?.match(/\/feedbacks\/(\d+)/);
            const id = idMatch ? parseInt(idMatch[1]) : NaN;

            const feedback = await this.service.buscarFeedbackPorId(id);

            if (!feedback) {
                return this.renderError(res, 'Feedback não encontrado', `O feedback com ID ${id} não foi localizado.`, 404);
            }

            renderFile(path.join(__dirname, '../views/feedbacks_show_view.ejs'), { feedback }, (err: any, html: any) => {
                if (err) return this.renderError(res, 'Erro ao renderizar', err.message);
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(html);
            });
        } catch {
            this.renderError(res, 'Erro ao carregar feedback', 'Ocorreu um erro ao tentar exibir o feedback.');
        }
    }

    async store(req: IncomingMessage, res: ServerResponse) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { titulo, descricao, tipo } = parseBody(body);

                const tituloValue = Array.isArray(titulo) ? titulo[0] : titulo;
                const descricaoValue = Array.isArray(descricao) ? descricao[0] : descricao;
                const tipoValue = asTipoFeedback(Array.isArray(tipo) ? tipo[0] : tipo!);

                // Verificar se algum valor está faltando
                if (!tituloValue || !descricaoValue || !tipoValue) {
                    throw new Error('Os campos título, descrição e tipo são obrigatórios.');
                }

                // Chamar o serviço com valores válidos
                await this.service.criarFeedback(tituloValue, descricaoValue, tipoValue);

                renderFile(path.join(__dirname, '../views/formulario_view.ejs'), {
                    mensagemSucesso: 'Feedback adicionado com sucesso!',
                    titulo: '',
                    descricao: '',
                    tipo: ''
                }, (err: any, html: any) => {
                    if (err) return this.renderError(res, 'Erro ao renderizar', err.message);
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(html);
                });
            } catch {
                this.renderError(res, 'Erro ao cadastrar feedback', 'Não foi possível salvar seu feedback.');
            }
        });
    }

    async update(req: IncomingMessage, res: ServerResponse) {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { id, status } = parseBody(body);

                const idValue = Array.isArray(id) ? id[0] : id;
                const statusValue = asStatusFeedback(Array.isArray(status) ? status[0] : status!);

                // Verificar se algum valor está faltando
                if (!idValue || !statusValue) {
                    throw new Error('Os campos título, descrição e tipo são obrigatórios.');
                }

                await this.service.atualizarStatus(parseInt(idValue!), statusValue);
                res.writeHead(302, { Location: `/feedbacks/${id}` });
                res.end();
            } catch {
                this.renderError(res, 'Erro ao atualizar feedback', 'Não foi possível atualizar o status do feedback.');
            }
        });
    }

    private renderError(res: ServerResponse, tituloErro: string, descricaoErro: string, status = 500) {
        renderFile(path.join(__dirname, '../views/error.ejs'), { tituloErro, descricaoErro }, (err: any, html: any) => {
            res.writeHead(status, { 'Content-Type': 'text/html' });
            res.end(err ? `<h1>${tituloErro}</h1><p>${descricaoErro}</p>` : html);
        });
    }
}
