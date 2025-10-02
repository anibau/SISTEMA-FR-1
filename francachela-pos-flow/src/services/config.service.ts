import { apiClient, extractData, extractDirectData } from './api';
import { mockSystemConfig } from './mock-data';
import { 
  SystemConfig, 
  GeneralConfig, 
  PaymentConfig,
  NotificationConfig,
  SecurityConfig
} from '@/types/system.types';

export class ConfigService {
  private static instance: ConfigService;

  private constructor() {}

  static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  // Configuración general del sistema
  async getSystemConfig(): Promise<SystemConfig> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulamos delay
      return { ...mockSystemConfig };
    }

    const response = await apiClient.get<SystemConfig>('/config/system');
    return extractDirectData(response);
  }

  // Configuración general (nombre, dirección, etc.)
  async getGeneralConfig(): Promise<GeneralConfig> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 300)); // Simulamos delay
      return { ...mockSystemConfig.general };
    }

    const response = await apiClient.get<GeneralConfig>('/config/general');
    return extractDirectData(response);
  }

  async updateGeneralConfig(config: Partial<GeneralConfig>): Promise<GeneralConfig> {
    if (apiClient.shouldUseMocks()) {
      // En un entorno mock, simplemente combinamos la configuración existente con la nueva
      mockSystemConfig.general = { ...mockSystemConfig.general, ...config };
      return mockSystemConfig.general;
    }

    const response = await apiClient.put<GeneralConfig>('/config/general', config);
    return extractDirectData(response);
  }

  async uploadLogo(file: File): Promise<{ logoUrl: string }> {
    if (apiClient.shouldUseMocks()) {
      // Simulamos la carga de un logo
      await new Promise(resolve => setTimeout(resolve, 800));
      return { logoUrl: `/logo-${Date.now()}.png` };
    }

    const formData = new FormData();
    formData.append('logo', file);

    const response = await apiClient.post<{ logoUrl: string }>('/config/logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return extractDirectData(response);
  }

  // Configuración de pagos
  async getPaymentConfig(): Promise<PaymentConfig> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { ...mockSystemConfig.payments };
    }

    const response = await apiClient.get<PaymentConfig>('/config/payments');
    return extractDirectData(response);
  }

  async updatePaymentConfig(config: Partial<PaymentConfig>): Promise<PaymentConfig> {
    if (apiClient.shouldUseMocks()) {
      mockSystemConfig.payments = { ...mockSystemConfig.payments, ...config };
      return mockSystemConfig.payments;
    }

    const response = await apiClient.put<PaymentConfig>('/config/payments', config);
    return extractDirectData(response);
  }

  // Configuración de notificaciones
  async getNotificationConfig(): Promise<NotificationConfig> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { ...mockSystemConfig.notifications };
    }

    const response = await apiClient.get<NotificationConfig>('/config/notifications');
    return extractDirectData(response);
  }

  async updateNotificationConfig(config: Partial<NotificationConfig>): Promise<NotificationConfig> {
    if (apiClient.shouldUseMocks()) {
      mockSystemConfig.notifications = { ...mockSystemConfig.notifications, ...config };
      return mockSystemConfig.notifications;
    }

    const response = await apiClient.put<NotificationConfig>('/config/notifications', config);
    return extractDirectData(response);
  }

  // Configuración de seguridad
  async getSecurityConfig(): Promise<SecurityConfig> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return { ...mockSystemConfig.security };
    }

    const response = await apiClient.get<SecurityConfig>('/config/security');
    return extractDirectData(response);
  }

  async updateSecurityConfig(config: Partial<SecurityConfig>): Promise<SecurityConfig> {
    if (apiClient.shouldUseMocks()) {
      mockSystemConfig.security = { ...mockSystemConfig.security, ...config };
      return mockSystemConfig.security;
    }

    const response = await apiClient.put<SecurityConfig>('/config/security', config);
    return extractDirectData(response);
  }

  // Prueba de notificaciones
  async testNotification(type: 'email' | 'sms', recipient: string): Promise<{ success: boolean; message: string }> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulamos un delay mayor para envío
      return {
        success: true,
        message: `Notificación de prueba enviada a ${recipient} vía ${type}`
      };
    }

    const response = await apiClient.post<{ success: boolean; message: string }>('/config/notifications/test', { type, recipient });
    return extractDirectData(response);
  }
}

export const configService = ConfigService.getInstance();