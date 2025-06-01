import api from './api';
import type { AnalysisAssistant, ApiResponse, PaginatedResponse } from '../types';

export const analysisAssistantsService = {
  // Get all analysis assistants with pagination
  getAnalysisAssistants: async (page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<AnalysisAssistant>>('/analysis-assistants', {
      params: { page, size }
    });
    return response.data;
  },

  // Get a single analysis assistant by ID
  getAnalysisAssistant: async (id: number) => {
    const response = await api.get<ApiResponse<AnalysisAssistant>>(`/analysis-assistants/${id}`);
    return response.data;
  },

  // Create a new analysis assistant
  createAnalysisAssistant: async (assistant: Omit<AnalysisAssistant, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post<ApiResponse<AnalysisAssistant>>('/analysis-assistants', assistant);
    return response.data;
  },

  // Update an existing analysis assistant
  updateAnalysisAssistant: async (id: number, assistant: Partial<AnalysisAssistant>) => {
    const response = await api.put<ApiResponse<AnalysisAssistant>>(`/analysis-assistants/${id}`, assistant);
    return response.data;
  },

  // Delete an analysis assistant
  deleteAnalysisAssistant: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/analysis-assistants/${id}`);
    return response.data;
  }
}; 