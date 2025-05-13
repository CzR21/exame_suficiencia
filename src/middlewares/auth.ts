import { IncomingMessage, ServerResponse } from 'http';
import jwt from 'jsonwebtoken';
import { parse } from 'cookie';
import { JWT_SECRET } from '../config/config';

export async function verificarAutenticacao(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const url = req.url || '';
    const method = req.method || 'GET';

    // Permitir acesso irrestrito a POSTs e rotas fora de "feedback"
    if (!url.includes('feedback') || method === 'POST') {
        return true;
    }

    const cookies = req.headers.cookie ? parse(req.headers.cookie) : {};
    const token = cookies['token'];

    if (!token) {
        redirecionarLogin(res);
        return false;
    }

    try {
        jwt.verify(token, JWT_SECRET);
        return true;
    } catch {
        redirecionarLogin(res);
        return false;
    }
}

function redirecionarLogin(res: ServerResponse) {
    res.writeHead(302, { Location: '/login' });
    res.end();
}
