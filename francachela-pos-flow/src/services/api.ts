import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { showError } from '@/lib/toast';

// Configuración base de la API
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

// Tipos para las respuestas de la API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Cliente HTTP base
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor - Agregar token de autenticación
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - Manejar errores globalmente
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error) => {
        this.handleError(error);
        return Promise.reject(error);
      }
    );
  }

  private handleError(error: any) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Token expirado o inválido
          localStorage.removeItem('auth_token');
          window.location.href = '/login';
          showError('Sesión expirada. Por favor, inicia sesión nuevamente.');
          break;
        case 403:
          showError('No tienes permisos para realizar esta acción.');
          break;
        case 404:
          showError('Recurso no encontrado.');
          break;
        case 422:
          // Errores de validación
          const errors = data?.errors || data?.message;
          if (Array.isArray(errors)) {
            errors.forEach((err: any) => showError(err.message || err));
          } else {
            showError(errors || 'Error de validación');
          }
          break;
        case 500:
          showError('Error interno del servidor. Inténtalo más tarde.');
          break;
        default:
          showError(data?.message || 'Error inesperado');
      }
    } else if (error.request) {
      showError('No se pudo conectar con el servidor. Verifica tu conexión.');
    } else {
      showError('Error de configuración');
    }
  }

  // Métodos HTTP genéricos
  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // Método para verificar si usar mocks
  shouldUseMocks(): boolean {
    return USE_MOCKS;
  }
}

// Instancia singleton del cliente
export const apiClient = new ApiClient();

// Helper para extraer datos de la respuesta
export const extractData = <T>(response: AxiosResponse<ApiResponse<T>>): T => {
  return response.data.data;
};

// Helper para manejar respuestas paginadas
export const extractPaginatedData = <T>(response: AxiosResponse<PaginatedResponse<T>>) => {
  return {
    data: response.data.data,
    pagination: response.data.pagination,
  };
}; 