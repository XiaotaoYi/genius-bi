import api from './api';
import type { Model, ApiResponse, PaginatedResponse, ModelDimension, ModelMetric } from '../types';

// Add the ModelService interface to include the new method
export interface ModelService {
  getModels: (page?: number, size?: number) => Promise<PaginatedResponse<Model>>;
  getModel: (id: number) => Promise<ApiResponse<Model>>;
  createModel: (model: Omit<Model, 'id' | 'created_at' | 'updated_at'>) => Promise<ApiResponse<Model>>;
  updateModel: (id: number, model: Partial<Model>) => Promise<ApiResponse<Model>>;
  deleteModel: (id: number) => Promise<ApiResponse<void>>;
  getModelDimensions: (modelId: number, page?: number, size?: number) => Promise<PaginatedResponse<ModelDimension>>;
  getModelMetrics: (modelId: number, page?: number, size?: number) => Promise<PaginatedResponse<ModelMetric>>;
  // Add the new method here
  getModelFields: (modelId: number) => Promise<ApiResponse<any>>; // Adjust return type if needed
}

export const modelsService: ModelService = {
  // Get all models with pagination
  getModels: async (page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<Model>>('/models', {
      params: { page, size }
    });
    return response.data;
  },

  // Get a single model by ID
  getModel: async (id: number) => {
    const response = await api.get<ApiResponse<Model>>(`/models/${id}`);
    return response.data;
  },

  // Create a new model
  createModel: async (model: Omit<Model, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post<ApiResponse<Model>>('/models', model);
    return response.data;
  },

  // Update an existing model
  updateModel: async (id: number, model: Partial<Model>) => {
    const response = await api.put<ApiResponse<Model>>(`/models/${id}`, model);
    return response.data;
  },

  // Delete a model
  deleteModel: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/models/${id}`);
    return response.data;
  },

  getModelDimensions: async (modelId: number, page: number = 1, size: number = 100) => {
    const response = await api.get(`/models/${modelId}/dimensions?page=${page}&limit=${size}`);
    return response.data;
  },

  getModelMetrics: async (modelId: number, page: number = 1, size: number = 100) => {
    const response = await api.get(`/models/${modelId}/metrics?page=${page}&limit=${size}`);
    return response.data;
  },

  // Implement the new method
  getModelFields: async (modelId: number) => {
    const response = await api.get<ApiResponse<any>>(`/models/${modelId}/fields`); // Adjust return type if needed
    return response.data;
  }
}; 