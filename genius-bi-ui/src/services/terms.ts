import api from './api';
import type { Term, ApiResponse, PaginatedResponse } from '../types';

export const termsService = {
  // Get all terms with pagination
  getTerms: async (page: number = 1, size: number = 10) => {
    const response = await api.get<PaginatedResponse<Term>>('/terms', {
      params: { page, size }
    });
    return response.data;
  },

  // Get a single term by ID
  getTerm: async (id: number) => {
    const response = await api.get<ApiResponse<Term>>(`/terms/${id}`);
    return response.data;
  },

  // Create a new term
  createTerm: async (term: Omit<Term, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post<ApiResponse<Term>>('/terms', term);
    return response.data;
  },

  // Update an existing term
  updateTerm: async (id: number, term: Partial<Term>) => {
    const response = await api.put<ApiResponse<Term>>(`/terms/${id}`, term);
    return response.data;
  },

  // Delete a term
  deleteTerm: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/terms/${id}`);
    return response.data;
  }
}; 