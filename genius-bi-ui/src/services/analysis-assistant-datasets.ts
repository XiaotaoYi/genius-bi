import api from './api';
import type { AnalysisAssistantDataset, ApiResponse, PaginatedResponse } from '../types';

export const analysisAssistantDatasetsService = {
  // Get all analysis assistant datasets with pagination
  getAnalysisAssistantDatasets: async (page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<AnalysisAssistantDataset>>('/analysis-assistant-datasets', {
      params: { page, size }
    });
    return response.data;
  },

  // Get datasets by analysis assistant ID
  getDatasetsByAssistantId: async (assistant_id: number, page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<AnalysisAssistantDataset>>(
      `/analysis-assistants/${assistant_id}/datasets`,
      { params: { page, size } }
    );
    return response.data;
  },

  // Get a single analysis assistant dataset by ID
  getAnalysisAssistantDataset: async (id: number) => {
    const response = await api.get<ApiResponse<AnalysisAssistantDataset>>(`/analysis-assistant-datasets/${id}`);
    return response.data;
  },

  // Create a new analysis assistant dataset
  createAnalysisAssistantDataset: async (
    assistantDataset: Omit<AnalysisAssistantDataset, 'id' | 'created_at' | 'updated_at'>
  ) => {
    const response = await api.post<ApiResponse<AnalysisAssistantDataset>>(
      '/analysis-assistant-datasets',
      assistantDataset
    );
    return response.data;
  },

  // Update an existing analysis assistant dataset
  updateAnalysisAssistantDataset: async (id: number, assistantDataset: Partial<AnalysisAssistantDataset>) => {
    const response = await api.put<ApiResponse<AnalysisAssistantDataset>>(
      `/analysis-assistant-datasets/${id}`,
      assistantDataset
    );
    return response.data;
  },

  // Delete an analysis assistant dataset
  deleteAnalysisAssistantDataset: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/analysis-assistant-datasets/${id}`);
    return response.data;
  }
}; 