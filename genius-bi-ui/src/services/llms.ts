import api from './api';
import type { LLM, ApiResponse, PaginatedResponse } from '../types';

export const llmsService = {
  // Get all LLMs with pagination
  getLLMs: async (page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<LLM>>('/llms', {
      params: { page, size }
    });
    return response.data;
  },

  // Get a single LLM by ID
  getLLM: async (id: number) => {
    const response = await api.get<ApiResponse<LLM>>(`/llms/${id}`);
    return response.data;
  },

  // Create a new LLM
  createLLM: async (llm: Omit<LLM, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post<ApiResponse<LLM>>('/llms', llm);
    return response.data;
  },

  // Update an existing LLM
  updateLLM: async (id: number, llm: Partial<LLM>) => {
    const response = await api.put<ApiResponse<LLM>>(`/llms/${id}`, llm);
    return response.data;
  },

  // Delete an LLM
  deleteLLM: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/llms/${id}`);
    return response.data;
  }
}; 