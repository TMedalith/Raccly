import { papersService } from '@/features/papers/services/papers.service';
import type { ChatResponse } from '../types';

/**
 * Genera una respuesta del asistente con referencias a papers
 */
function generateResponseWithReferences(query: string, numPapers: number): string {
    const refs = Array.from({ length: numPapers }, (_, i) => `[${i + 1}]`);
  const allRefs = refs.join(', ');

    const responses = [
    `He encontrado información relevante sobre "${query}". Los estudios más importantes en este campo ${refs[0] || '[1]'} proporcionan un análisis exhaustivo de las metodologías fundamentales. Investigaciones complementarias ${refs[1] || '[2]'} demuestran aplicaciones prácticas, mientras que trabajos recientes ${refs[2] || '[3]'} extienden estos hallazgos. Estos papers establecen las bases del conocimiento actual en esta área de investigación.`,

    `Basándome en la literatura científica actual sobre "${query}", puedo destacar varios hallazgos clave. Las investigaciones ${refs[0] || '[1]'} presentan el marco teórico principal, que ha sido validado y extendido por estudios subsecuentes ${refs[1] || '[2]'}${refs[2] ? ` y ${refs[2]}` : ''}. Este cuerpo de trabajo ha contribuido sustancialmente al entendimiento actual del tema.`,

    `En relación a "${query}", la evidencia científica muestra avances significativos. Los papers más citados ${allRefs} presentan metodologías robustas y resultados reproducibles. Estos estudios han establecido consensos importantes y abierto nuevas líneas de investigación que están transformando nuestra comprensión del tema.`,
  ];

    return responses[Math.floor(Math.random() * responses.length)];
}

export const chatService = {
  /**
   * Envía un mensaje y recibe una respuesta del asistente con papers relacionados
   * @param message - El mensaje del usuario
   * @returns Promise con la respuesta y papers relacionados
   */
  async sendMessage(message: string): Promise<ChatResponse> {
        await new Promise((resolve) => setTimeout(resolve, 1200));

                            
        const { papers } = await papersService.searchPapers(message);

        const relevantPapers = papers.slice(0, Math.min(4, papers.length));

        const responseText = generateResponseWithReferences(
      message,
      relevantPapers.length
    );

    return {
      message: responseText,
      papers: relevantPapers,
    };
  },

  /**
   * Obtiene el historial de conversación
   * @param conversationId - ID de la conversación
   * @returns Promise con el historial de mensajes
   */
  async getConversationHistory(conversationId: string) {
        await new Promise((resolve) => setTimeout(resolve, 500));
    return [];
  },

  /**
   * Genera un título para la conversación basado en el primer mensaje
   * @param firstMessage - Primer mensaje de la conversación
   * @returns Título sugerido
   */
  generateConversationTitle(firstMessage: string): string {
        const title = firstMessage.trim().slice(0, 50);
    return title.length < firstMessage.trim().length ? `${title}...` : title;
  },
};
