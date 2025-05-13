import { Request, Response } from 'express';
import { FeedbackService } from '../services/FeedbackService';

export class FeedbackController {
    private service = new FeedbackService();

    async index(req: Request, res: Response) {
        try {
            const feedbacks = await this.service.listarFeedbacks();
            res.render('feedbacks_view', { feedbacks });
        } catch (error) {
            res.status(500).render('error', {
                tituloErro: 'Erro ao listar feedbacks',
                descricaoErro: 'Ocorreu um erro ao carregar os feedbacks. Tente novamente mais tarde.'
            });
        }
    }

    async show(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.idFeedback);
            const feedback = await this.service.buscarFeedbackPorId(id);

            if (!feedback) {
                return res.status(404).render('error', {
                    tituloErro: 'Feedback não encontrado',
                    descricaoErro: `O feedback com ID ${id} não foi localizado.`
                });
            }

            res.render('feedbacks_show_view', { feedback });
        } catch (error) {
            res.status(500).render('error', {
                tituloErro: 'Erro ao carregar feedback',
                descricaoErro: 'Ocorreu um erro ao tentar exibir o feedback. Tente novamente mais tarde.'
            });
        }
    }

    async store(req: Request, res: Response) {
        try {
            const { titulo, descricao, tipo } = req.body;

            await this.service.criarFeedback(titulo, descricao, tipo);

            res.render('formulario_view', {
                mensagemSucesso: 'Feedback adicionado com sucesso!',
                titulo: '',
                descricao: '',
                tipo: ''
            });
        } catch (error) {
            res.status(500).render('error', {
                tituloErro: 'Erro ao cadastrar feedback',
                descricaoErro: 'Não foi possível salvar seu feedback. Por favor, tente novamente.'
            });
        }
    }

    async update(req: Request, res: Response) {
        try {
            const { id, status } = req.body;
            await this.service.atualizarStatus(parseInt(id), status);
            res.redirect(`/feedbacks/${id}`);
        } catch (error) {
            res.status(500).render('error', {
                tituloErro: 'Erro ao atualizar feedback',
                descricaoErro: 'Não foi possível atualizar o status do feedback.'
            });
        }
    }
}
