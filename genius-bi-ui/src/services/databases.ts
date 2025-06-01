import api from './api';
import type { Database, PaginatedResponse, ApiResponse } from '../types';

export interface DatabasesService {
  getDatabases: (page?: number, size?: number) =>
    Promise<PaginatedResponse<Database>>;
  getDatabase: (id: number) =>
    Promise<Database>;
  createDatabase: (database: Omit<Database, 'id' | 'created_at' | 'updated_at'>) =>
    Promise<Database>;
  updateDatabase: (id: number, database: Partial<Database>) =>
    Promise<Database>;
  deleteDatabase: (id: number) =>
    Promise<ApiResponse<void>>;
  getDatabaseNames: (databaseId: number) =>
    Promise<string[]>;
  getTableNames: (databaseId: number, databaseName: string) =>
    Promise<string[]>;
  getTableFields: (databaseId: number, databaseName: string, tableName: string) =>
    Promise<any[]>; // Assuming fields are any[] for now
}

export const databasesService: DatabasesService = {
  // Get all databases with pagination
  getDatabases: async (page?: number, size?: number) => {
    const response = await api.get<PaginatedResponse<Database>>('/databases/', { params: { page, limit: size } });
    return response.data;
  },

  // Get a single database by ID
  getDatabase: async (id: number) => {
    const response = await api.get<ApiResponse<Database>>(`/databases/${id}`);
    return response.data.data; // Assuming ApiResponse wraps the actual data under a 'data' key
  },

  // Create a new database
  createDatabase: async (database: Omit<Database, 'id' | 'created_at' | 'updated_at'>) => {
    const response = await api.post<ApiResponse<Database>>('/databases/', database);
    return response.data.data; // Assuming ApiResponse wraps the actual data under a 'data' key
  },

  // Update an existing database
  updateDatabase: async (id: number, database: Partial<Database>) => {
    const response = await api.put<ApiResponse<Database>>(`/databases/${id}`, database);
    return response.data.data; // Assuming ApiResponse wraps the actual data under a 'data' key
  },

  // Delete a database
  deleteDatabase: async (id: number) => {
    const response = await api.delete<ApiResponse<void>>(`/databases/${id}`);
    return response.data; // This returns ApiResponse<void>
  },

  getDatabaseNames: async (databaseId: number) => {
    const response = await api.get<string[]>(`/databases/${databaseId}/names`);
    return response.data;
  },

  getTableNames: async (databaseId: number, databaseName: string) => {
    const response = await api.get<string[]>(`/databases/${databaseId}/tables`, { params: { database_name: databaseName } });
    return response.data;
  },

  getTableFields: async (databaseId: number, databaseName: string, tableName: string) => {
    const response = await api.get<any[]>(`/databases/${databaseId}/tables/${tableName}/fields`, { params: { database_name: databaseName } });
    return response.data;
  }
}; 