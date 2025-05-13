import { Conexao } from '../database/conexao';

export type TipoFeedback = 'bug' | 'sugestão' | 'reclamação' | 'feedback';
export type StatusFeedback = 'recebido' | 'em análise' | 'em desenvolvimento' | 'finalizado';

export class Feedback extends Conexao {
  id?: number;
  titulo: string;
  descricao: string;
  tipo: TipoFeedback;
  status: StatusFeedback;

  constructor(titulo: string, descricao: string, tipo: TipoFeedback, status: StatusFeedback = 'recebido') {
    super();
    this.titulo = titulo;
    this.descricao = descricao;
    this.tipo = tipo;
    this.status = status;
  }

  static async listarTodos(): Promise<Feedback[]> {
    return await this.query<Feedback>('SELECT * FROM feedbacks ORDER BY id DESC');
  }

  static async buscarPorId(id: number): Promise<Feedback | null> {
    const result = await this.query<Feedback>('SELECT * FROM feedbacks WHERE id = $1', [id]);
    return result.length > 0 ? result[0] : null;
  }

  async salvar(): Promise<void> {
    await Feedback.query(
      'INSERT INTO feedbacks (titulo, descricao, tipo, status) VALUES ($1, $2, $3, $4)',
      [this.titulo, this.descricao, this.tipo, this.status]
    );
  }

  static async atualizarStatus(id: number, status: StatusFeedback): Promise<void> {
    await this.query('UPDATE feedbacks SET status = $1 WHERE id = $2', [status, id]);
  }
}
