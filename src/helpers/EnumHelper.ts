import { StatusFeedback, TipoFeedback } from "../models/Feedback";

export function asStatusFeedback(valor: string): StatusFeedback | null {
    const statusValidos: StatusFeedback[] = ['recebido', 'em análise', 'em desenvolvimento', 'finalizado'];
    if (statusValidos.includes(valor as StatusFeedback)) {
        return valor as StatusFeedback;
    }
    return null; // Retorna null se não for um valor válido
}

export function asTipoFeedback(valor: string): TipoFeedback | null {
    const tiposValidos: TipoFeedback[] = ['bug', 'sugestão', 'reclamação', 'feedback'];
    if (tiposValidos.includes(valor as TipoFeedback)) {
        return valor as TipoFeedback;
    }
    return null; // Retorna null se não for um valor válido
}
