import { HttpService } from '@/shared/services/http.service';
import type { Conversation, ApiResponse } from '../types';

class ConversationsService extends HttpService {
  constructor() {
    super('/api/conversations');
  }

  private mockConversations: Conversation[] = [
    {
      id: '1',
      title: 'Inmunoterapia cáncer',
      color: 'lavender',
      lastMessage: 'Últimos avances en tratamientos...',
      updatedAt: 'Hace 2 días',
    },
    {
      id: '2',
      title: 'CRISPR aplicaciones',
      color: 'mint',
      lastMessage: 'Edición genética en medicina...',
      updatedAt: 'Hace 1 semana',
    },
    {
      id: '3',
      title: 'Machine learning diabetes',
      color: 'peach',
      lastMessage: 'Predicción de riesgo mediante IA...',
      updatedAt: 'Hace 2 semanas',
    },
    {
      id: '4',
      title: 'Genética del Alzheimer',
      color: 'pink',
      lastMessage: 'Factores de riesgo genético...',
      updatedAt: 'Hace 3 semanas',
    },
  ];

  async getRecent(): Promise<ApiResponse<Conversation[]>> {
    await new Promise((resolve) => setTimeout(resolve, 800));

    return {
      success: true,
      data: this.mockConversations,
    };
  }

  async getById(id: string): Promise<ApiResponse<Conversation>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const conversation = this.mockConversations.find((c) => c.id === id);

    if (!conversation) {
      return {
        success: false,
        data: {} as Conversation,
        error: 'Conversation not found',
      };
    }

    return {
      success: true,
      data: conversation,
    };
  }

  async create(title: string): Promise<ApiResponse<Conversation>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const newConversation: Conversation = {
      id: Date.now().toString(),
      title,
      color: 'sky',
      lastMessage: 'Nueva conversación',
      updatedAt: 'Ahora',
    };

    this.mockConversations.unshift(newConversation);

    return {
      success: true,
      data: newConversation,
    };
  }

  async deleteConversation(id: string): Promise<ApiResponse<void>> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const index = this.mockConversations.findIndex((c) => c.id === id);

    if (index === -1) {
      return {
        success: false,
        data: undefined,
        error: 'Conversation not found',
      };
    }

    this.mockConversations.splice(index, 1);

    return {
      success: true,
      data: undefined,
    };
  }
}

export const conversationsService = new ConversationsService();
