import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/config';

export function verificarAutenticacao(req: Request, res: Response, next: NextFunction) {
  if (!req.path.includes('feedback') || req.method == 'POST') return next();

  const token = req.cookies?.token;
  if (!token) return res.redirect('/login');
  
  try {
    jwt.verify(token, JWT_SECRET);
    return next();
  } catch (error) {
    return res.redirect('/login');
  }
}
