// Database Models
export interface Term {
  id: number;
  name: string;
  synonym: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface LLM {
  id: number;
  connection_name: string;
  api_protocal: string;
  base_url?: string;
  api_key?: string;
  model_name?: string;
  api_version?: string;
  temperature?: number;
  timeout?: number;
  description?: string;
  create_by?: string;
  create_time?: string;
  update_by?: string;
  update_time?: string;
}

export interface Database {
  id: number;
  name: string;
  type: string;
  jdbc_str: string;
  version: string;
  user: string;
  password?: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Model {
  id: number;
  database_id: number;
  database_name: string;
  table_name: string;
  model_name: string;
  description: string;
  created_at: string;
  updated_at: string;
  fields?: any[];
}

export interface Dimension {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Metric {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface Dataset {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface DatasetFieldPayload {
  field_id?: number; // Allow string for initial state before number conversion
  alias: string;
  type: 'dimension' | 'metric';
  // Include other necessary fields if the backend expects them
  // e.g., original field id, etc.
}

export interface DatasetCreatePayload extends Omit<Dataset, 'id' | 'created_at' | 'updated_at'> {
  fields: DatasetFieldPayload[];
}

export interface DatasetField {
  id: number;
  dataset_id: number;
  name: string;
  description: string;
  field_type: string;
  created_at: string;
  updated_at: string;
}

export interface AnalysisAssistant {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface AnalysisAssistantDataset {
  id: number;
  analysis_assistant_id: number;
  dataset_id: number;
  created_at: string;
  updated_at: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

export interface CreateModelPayload extends Omit<Model, 'id' | 'created_at' | 'updated_at'> {
  fields?: any[];
}

export interface ModelDimension {
  id: number;
  model_id: number;
  name: string;
  alias?: string;
  dimension_type?: string;
  description?: string;
  express?: string;
  create_by?: string;
  create_time?: string;
  update_by?: string;
  update_time?: string;
}

export interface ModelMetric {
  id: number;
  model_id: number;
  name: string;
  alias?: string;
  metric_type?: string;
  description?: string;
  express?: string;
  create_by?: string;
  create_time?: string;
  update_by?: string;
  update_time?: string;
}

export interface ChatAssistantBase {
  chat_name: string;
  chat_description?: string;
  analysis_assistant_id: number;
  create_by?: string;
}

export interface ChatAssistantCreate extends ChatAssistantBase {}

export interface ChatAssistantUpdate {
  chat_name?: string;
  chat_description?: string;
  analysis_assistant_id?: number;
  update_by?: string;
}

export interface ChatAssistant extends ChatAssistantBase {
  id: number;
  create_time?: string;
  update_time?: string;
} 

export interface ChatAssistantQuery {
  chat_id: number;
  query: string;
}