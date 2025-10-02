import { apiClient, extractDirectData } from './api';
import { mockApi } from './mocks';
import { PointsConfig, PointsTransaction, Customer } from '@/types/system.types';
import { mockPointsConfig, mockCustomers, mockPointsTransactions } from './mock-data';

export class PointsService {
  private static instance: PointsService;

  private constructor() {}

  static getInstance(): PointsService {
    if (!PointsService.instance) {
      PointsService.instance = new PointsService();
    }
    return PointsService.instance;
  }

  async getPointsConfig(): Promise<PointsConfig> {
    if (apiClient.shouldUseMocks()) {
      // Hacer una llamada simulada a la configuración de puntos
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockPointsConfig;
    }

    const response = await apiClient.get<PointsConfig>('/points/config');
    return extractDirectData(response);
  }

  async updatePointsConfig(config: Partial<PointsConfig>): Promise<PointsConfig> {
    if (apiClient.shouldUseMocks()) {
      // En mock simplemente retornamos los datos actualizados
      await new Promise(resolve => setTimeout(resolve, 300));
      const updatedConfig = { ...mockPointsConfig, ...config };
      // Actualizar mock
      Object.assign(mockPointsConfig, updatedConfig);
      return updatedConfig;
    }

    const response = await apiClient.put<PointsConfig>('/points/config', config);
    return extractDirectData(response);
  }

  async getCustomersWithPoints(): Promise<Customer[]> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      return mockCustomers.filter(c => c.points > 0);
    }

    const response = await apiClient.get<Customer[]>('/points/customers');
    return extractDirectData(response);
  }

  async getCustomerPoints(customerId: string): Promise<{ points: number; transactions: PointsTransaction[] }> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      const customer = mockCustomers.find(c => c.id === customerId);
      const transactions = mockPointsTransactions.filter(t => t.customerId === customerId);
      
      return {
        points: customer?.points || 0,
        transactions
      };
    }

    const response = await apiClient.get<{ points: number; transactions: PointsTransaction[] }>(`/points/customers/${customerId}`);
    return extractDirectData(response);
  }

  async createPointsTransaction(transactionData: {
    customerId: string;
    type: 'add' | 'redeem';
    points: number;
    reason: string;
    description?: string;
  }): Promise<PointsTransaction> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Encontrar cliente
      const customer = mockCustomers.find(c => c.id === transactionData.customerId);
      if (!customer) {
        throw new Error('Cliente no encontrado');
      }
      
      // Verificar puntos suficientes para redimir
      if (transactionData.type === 'redeem' && customer.points < transactionData.points) {
        throw new Error('El cliente no tiene suficientes puntos para canjear');
      }
      
      // Actualizar puntos del cliente
      if (transactionData.type === 'add') {
        customer.points += transactionData.points;
      } else {
        customer.points -= transactionData.points;
      }
      customer.lastPointsActivity = new Date();
      
      // Crear nueva transacción
      const newTransaction: PointsTransaction = {
        id: `pt-${Date.now()}`,
        customerId: transactionData.customerId,
        customerName: customer.name,
        type: transactionData.type,
        points: transactionData.points,
        reason: transactionData.reason,
        description: transactionData.description,
        date: new Date(),
        expiryDate: new Date(Date.now() + (mockPointsConfig.pointsExpirationDays * 86400000))
      };
      
      // Añadir a las transacciones
      mockPointsTransactions.unshift(newTransaction);
      
      return newTransaction;
    }

    const response = await apiClient.post<PointsTransaction>('/points/transactions', transactionData);
    return extractDirectData(response);
  }

  async getPointsTransactions(
    startDate?: Date, 
    endDate?: Date,
    customerId?: string,
    type?: 'add' | 'redeem'
  ): Promise<PointsTransaction[]> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockPointsTransactions.filter(t => {
        let matches = true;
        
        if (customerId && t.customerId !== customerId) matches = false;
        if (type && t.type !== type) matches = false;
        if (startDate && new Date(t.date) < startDate) matches = false;
        if (endDate && new Date(t.date) > endDate) matches = false;
        
        return matches;
      });
    }

    const response = await apiClient.get<PointsTransaction[]>('/points/transactions', {
      params: {
        customerId,
        type,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      }
    });
    return extractDirectData(response);
  }

  async calculatePointsForPurchase(amount: number): Promise<number> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 200));
      
      const config = mockPointsConfig;
      return Math.floor(amount / config.pointsPerPurchaseAmount);
    }

    const response = await apiClient.get<{ points: number }>('/points/calculate', {
      params: { amount }
    });
    return extractDirectData(response).points;
  }
}

export const pointsService = PointsService.getInstance();

// Asegurarnos de exportar el servicio en services/index.ts