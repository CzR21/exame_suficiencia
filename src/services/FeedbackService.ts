import { Feedback, StatusFeedback, TipoFeedback } from '../models/Feedback';

export class FeedbackService {
  async listarFeedbacks() {
    return await Feedback.listarTodos();
  }

  async buscarFeedbackPorId(id: number) {
    return await Feedback.buscarPorId(id);
  }

  async criarFeedback(titulo: string, descricao: string, tipo: TipoFeedback) {
    const feedback = new Feedback(titulo, descricao, tipo);
    await feedback.salvar();
  }

  async atualizarStatus(id: number, status: StatusFeedback) {
    await Feedback.atualizarStatus(id, status);
  }
}
