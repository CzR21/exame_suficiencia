import { IncomingMessage, ServerResponse } from 'http';
import { parse as parseUrl } from 'url';
import { parse as parseQuery } from 'querystring';
import path from 'path';
import jwt from 'jsonwebtoken';
import ejs from 'ejs'; // Importando o EJS
import { FeedbackController } from '../controllers/FeedbackController';
import { JWT_SECRET } from '../config/config';
import { parseCookies } from '../helpers/CoockieHelper';
import { renderError, renderView } from '../helpers/ErrorHelper';

const controller = new FeedbackController();

enum HTTP_METHODS { GET = 'GET', POST = 'POST', PUT = 'PUT' }

export async function rotas(req: IncomingMessage, res: ServerResponse): Promise<void> {

  const parsedUrl = parseUrl(req.url || '', true);
  const pathname = parsedUrl.pathname || '';
  const method = (req.method as HTTP_METHODS) || HTTP_METHODS.GET;

  const cookies = parseCookies(req);
  const token = cookies.token;

  // GET /login
  if (pathname === '/login' && method === HTTP_METHODS.GET) {
    return renderView(
      'login',
      { erro: '' },
      res,
      'Erro ao carregar login',
      'Não foi possível renderizar a página de login.'
    );
  }

  // POST /login
  if (pathname === '/login' && method === HTTP_METHODS.POST) {
    let body = '';
    req.on('data', chunk => (body += chunk));
    req.on('end', () => {
      const { usuario, senha } = parseQuery(body);
      if (usuario === 'admin' && senha === '123456') {
        const token = jwt.sign({ usuario: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
        res.writeHead(302, {
          'Set-Cookie': `token=${token}; HttpOnly`,
          Location: '/feedbacks',
        });
        return res.end();
      }
      // login inválido
      return renderView(
        'login',
        { erro: 'Usuário ou senha inválidos' },
        res,
        'Erro no login',
        'Usuário ou senha inválidos. Tente novamente.'
      );
    });
    return;
  }

  // GET / (formulário)
  if (pathname === '/' && method === HTTP_METHODS.GET) {
    return renderView(
      'formulario_view',
      { mensagemSucesso: '', titulo: '', descricao: '', tipo: 'feedback' },
      res,
      'Erro ao carregar formulário',
      'Não foi possível renderizar o formulário principal.'
    );
  }

  // POST (formulário)
  if (pathname === '/feedback/cadastrar' && method === HTTP_METHODS.POST) {
    return controller.store(req, res);
  }

  // PROTEÇÃO POR TOKEN
  try {
    if (!token) throw new Error('Sem token');
    jwt.verify(token, JWT_SECRET);
  } catch {
    res.writeHead(302, { Location: '/login' });
    res.end();
    return;
  }


  // GET /feedbacks
  if (pathname === '/feedbacks' && method === HTTP_METHODS.GET) {
    return controller.index(req, res);
  }

  // GET /feedbacks/:id
  const match = pathname.match(/^\/feedbacks\/(\d+)$/);
  if (match && method === HTTP_METHODS.GET) {
    (req as any).params = { idFeedback: match[1] };
    return controller.show(req, res);
  }

  // POST /feedback/atualizar
  if (pathname === '/feedback/atualizar' && method === HTTP_METHODS.POST) {
    return controller.update(req, res);
  }

  // 404 - Rota não encontrada
  return renderError(
    res,
    '404 - Página não encontrada',
    'A rota solicitada não existe.',
    404
  );
}
