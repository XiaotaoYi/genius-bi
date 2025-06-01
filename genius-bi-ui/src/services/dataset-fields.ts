import api from './api';
import type { DatasetField, ApiResponse, PaginatedResponse } from '../types';

export const datasetFieldsService = {
  // Get all dataset fields with pagination
  getDatasetFields: async (page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<DatasetField>>('/dataset-fields', {
      params: { page, size }
    });
    return response.data;
  },

  // Get dataset fields by dataset ID
  getDatasetFieldsByDatasetId: async (dataset_id: number, page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<DatasetField>>(`/datasets/${dataset_id}/fields`, {
      params: { page, size }
    });
    return response.data;
  },

  // Get a single dataset field by ID
  getDatasetField: async (id: number) => {
    const response = await api.get<ApiResponse<DatasetField>>(`/dataset-fields/${id}`);
    return response.data;
  },

  // Create a new dataset field
  createDatasetField: async (field: Omit<DatasetField, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post<ApiResponse<DatasetField>>('/dataset-fields', field);
    return response.data;
  },

  // Update an existing dataset field
  updateDatasetField: async (id: number, field: Partial<DatasetField>) => {
    const response = await api.put<ApiResponse<DatasetField>>(`/dataset-fields/${id}`, field);
    return response.data;
  },

  // Delete a dataset field
  deleteDatasetField: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/dataset-fields/${id}`);
    return response.data;
  }
}; 