import api from './api';
import type { Metric, ApiResponse, PaginatedResponse } from '../types';

export const metricsService = {
  // Get all metrics with pagination
  getMetrics: async (page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<Metric>>('/metrics', {
      params: { page, size }
    });
    return response.data;
  },

  // Get a single metric by ID
  getMetric: async (id: number) => {
    const response = await api.get<ApiResponse<Metric>>(`/metrics/${id}`);
    return response.data;
  },

  // Create a new metric
  createMetric: async (metric: Omit<Metric, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post<ApiResponse<Metric>>('/metrics', metric);
    return response.data;
  },

  // Update an existing metric
  updateMetric: async (id: number, metric: Partial<Metric>) => {
    const response = await api.put<ApiResponse<Metric>>(`/metrics/${id}`, metric);
    return response.data;
  },

  // Delete a metric
  deleteMetric: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/metrics/${id}`);
    return response.data;
  }
}; 