import api from './api';
import type { Dimension, ApiResponse, PaginatedResponse } from '../types';

export const dimensionsService = {
  // Get all dimensions with pagination
  getDimensions: async (page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<Dimension>>('/dimensions', {
      params: { page, size }
    });
    return response.data;
  },

  // Get a single dimension by ID
  getDimension: async (id: number) => {
    const response = await api.get<ApiResponse<Dimension>>(`/dimensions/${id}`);
    return response.data;
  },

  // Create a new dimension
  createDimension: async (dimension: Omit<Dimension, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post<ApiResponse<Dimension>>('/dimensions', dimension);
    return response.data;
  },

  // Update an existing dimension
  updateDimension: async (id: number, dimension: Partial<Dimension>) => {
    const response = await api.put<ApiResponse<Dimension>>(`/dimensions/${id}`, dimension);
    return response.data;
  },

  // Delete a dimension
  deleteDimension: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/dimensions/${id}`);
    return response.data;
  }
}; 