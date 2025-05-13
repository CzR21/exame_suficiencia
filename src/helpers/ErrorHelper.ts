import { ServerResponse } from "http";
import ejs from "ejs";
import path from "path";

export function renderView(view: string, data: Record<string, any>, res: ServerResponse, tituloErro: string, descricaoErro: string) {
  ejs.renderFile(
    path.join(__dirname, '../views', `${view}.ejs`),
    data,
    {},
    (err, str) => {
      if (err) return renderError(res, tituloErro, descricaoErro);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(str);
    }
  );
}

export function renderError(res: ServerResponse, tituloErro: string, descricaoErro: string, statusCode = 500) {
  ejs.renderFile(
    path.join(__dirname, '../views/error.ejs'),
    { tituloErro, descricaoErro },
    {},
    (err, str) => {
      if (err) {
        console.error('Erro ao renderizar página de erro:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        return res.end('Erro interno do servidor');
      }
      res.writeHead(statusCode, { 'Content-Type': 'text/html' });
      res.end(str);
    }
  );
}