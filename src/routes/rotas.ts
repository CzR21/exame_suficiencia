import express from 'express';
import jwt from 'jsonwebtoken';
import { FeedbackController } from '../controllers/FeedbackController';
import { JWT_SECRET } from '../config/config';

const router = express.Router();
const controller = new FeedbackController();

// Feedback
router.get('/', (req, res) => res.render('formulario_view', { mensagemSucesso: '',  titulo: '', descricao: '', tipo: '' }));
router.get('/feedbacks', (req, res) => controller.index(req, res));
router.get('/feedbacks/:idFeedback', (req, res) => controller.show(req, res));
router.post('/feedback/cadastrar', (req, res) => controller.store(req, res));
router.post('/feedback/atualizar', (req, res) => controller.update(req, res));

// Login
router.get('/login', (req, res) => res.render('login', { erro: null }));
router.post('/login', (req, res) => {
    const { usuario, senha } = req.body;

    if (usuario === 'admin' && senha === '123456') {
        const token = jwt.sign({ usuario: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        
        res.cookie('token', token, { httpOnly: true });

        return res.redirect('/feedbacks');
    }

    return res.render('login', { erro: 'Usuário ou senha inválidos' });
});

export default router;
