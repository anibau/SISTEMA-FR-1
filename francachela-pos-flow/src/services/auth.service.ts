import { apiClient, extractData } from './api';
import { mockApi } from './mocks';
import { LoginCredentials, AuthResponse, User } from '@/types/pos.types';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    if (apiClient.shouldUseMocks()) {
      const response = await mockApi.login(credentials.email, credentials.password);
      return {
        token: response.token,
        user: response.user,
        expiresIn: 3600 // 1 hora
      };
    }

    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    const authData = extractData(response);
    
    // Guardar token en localStorage
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    return authData;
  }

  async logout(): Promise<void> {
    if (apiClient.shouldUseMocks()) {
      await mockApi.logout();
    } else {
      try {
        await apiClient.post('/auth/logout');
      } catch (error) {
        // Ignorar errores en logout
        console.warn('Error during logout:', error);
      }
    }

    // Limpiar datos locales
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  }

  async getCurrentUser(): Promise<User | null> {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }

    if (apiClient.shouldUseMocks()) {
      return null;
    }

    try {
      const response = await apiClient.get<User>('/auth/profile');
      const user = extractData(response);
      localStorage.setItem('user', JSON.stringify(user));
      return user;
    } catch (error) {
      return null;
    }
  }

  async refreshToken(): Promise<AuthResponse> {
    if (apiClient.shouldUseMocks()) {
      const user = await this.getCurrentUser();
      if (!user) throw new Error('No user found');
      
      return {
        token: 'mock-refreshed-token-' + Date.now(),
        user,
        expiresIn: 3600
      };
    }

    const response = await apiClient.post<AuthResponse>('/auth/refresh');
    const authData = extractData(response);
    
    localStorage.setItem('auth_token', authData.token);
    localStorage.setItem('user', JSON.stringify(authData.user));
    
    return authData;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('auth_token');
    return !!token;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  getUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  hasRole(role: string): boolean {
    const user = this.getUser();
    return user?.role === role;
  }

  hasAnyRole(roles: string[]): boolean {
    const user = this.getUser();
    return user ? roles.includes(user.role) : false;
  }
}

// Exportar instancia singleton
export const authService = AuthService.getInstance(); 