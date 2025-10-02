import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, LoginCredentials, AuthResponse } from '@/types/pos.types';
import { authService } from '@/services/auth.service';
import { showSuccess, showError } from '@/lib/toast';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si hay un token al cargar la aplicación
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (token) {
          // Verificar si el token es válido y obtener información del usuario
          const userData = await authService.getCurrentUser();
          setUser(userData);
        }
      } catch (error) {
        // Token inválido, limpiar localStorage
        localStorage.removeItem('auth_token');
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const authData: AuthResponse = await authService.login(credentials);
      
      // Guardar token en localStorage
      localStorage.setItem('auth_token', authData.token);
      
      // Actualizar estado del usuario
      if (authData && authData.user) {
        setUser(authData.user);
        showSuccess(`Bienvenido, ${authData.user.name}`);
      } else {
        throw new Error('No se recibió información de usuario válida');
      }
    } catch (error) {
      console.error('Login error:', error);
      showError('Error al iniciar sesión. Por favor, verifica tus credenciales.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Limpiar estado local independientemente del resultado del logout
      localStorage.removeItem('auth_token');
      setUser(null);
      showSuccess('Sesión cerrada exitosamente');
    }
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing user:', error);
      // Si hay error al refrescar, hacer logout
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 