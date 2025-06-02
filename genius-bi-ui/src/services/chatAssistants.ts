import api from './api';
import type { ChatAssistant, ChatAssistantCreate, ChatAssistantQuery, PaginatedResponse,ApiResponse } from '../types';

export const chatAssistantsService = {
  // Get all chat assistants with pagination
  getChatAssistants: async (page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<ChatAssistant>>('/chat-assistants/', {
      params: { page, size }
    });
    return response.data;
  },

  // Create a new chat assistant
  createChatAssistant: async (chatAssistant: ChatAssistantCreate) => {
    const response = await api.post<ChatAssistant>('/chat-assistants/', chatAssistant);
    return response.data;
  },

  // Placeholder for sending a message (calls the parsing endpoint)
  sendMessage: async (query: ChatAssistantQuery) => {
    // Note: The backend endpoint currently just returns "", this is a placeholder call.
    // A real implementation would likely involve sending more data (like chat ID)
    // and expecting a structured response including the assistant's reply.
    const response = await api.post<ApiResponse<string>>('/chat-assistants/parsing', query);
    return response.data;
  }

  // We might add getChatAssistant (by ID), getMessagesByChatId, etc. later as needed.
}; 