import api from './api';
import type { Dataset, ApiResponse, PaginatedResponse, DatasetCreatePayload } from '../types';

export const datasetsService = {
  // Get all datasets with pagination
  getDatasets: async (page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<Dataset>>('/datasets', {
      params: { page, size }
    });
    return response.data;
  },

  // Get a single dataset by ID
  getDataset: async (id: number) => {
    const response = await api.get<ApiResponse<Dataset>>(`/datasets/${id}`);
    return response.data;
  },

  // Create a new dataset
  createDataset: async (dataset: DatasetCreatePayload) => {
    const response = await api.post<ApiResponse<Dataset>>('/datasets', dataset);
    return response.data;
  },

  // Update an existing dataset
  updateDataset: async (id: number, dataset: Partial<Dataset>) => {
    const response = await api.put<ApiResponse<Dataset>>(`/datasets/${id}`, dataset);
    return response.data;
  },

  // Delete a dataset
  deleteDataset: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/datasets/${id}`);
    return response.data;
  }
}; 