import { apiClient, extractData, extractPaginatedData } from './api';
import { mockApi } from './mocks';
import { Client, PaginationParams, ApiResponse } from '@/types/pos.types';

export class CustomersService {
  private static instance: CustomersService;

  private constructor() {}

  static getInstance(): CustomersService {
    if (!CustomersService.instance) {
      CustomersService.instance = new CustomersService();
    }
    return CustomersService.instance;
  }

  async getCustomers(params?: PaginationParams): Promise<{ data: Client[]; meta?: any }> {
    if (apiClient.shouldUseMocks()) {
      const clients = await mockApi.getClients();
      return { data: clients };
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await apiClient.get<ApiResponse<Client[]>>(`/clientes?${queryParams}`);
    return extractPaginatedData(response);
  }

  async getCustomerById(id: string): Promise<Client | null> {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getClientById(id);
    }

    try {
      const response = await apiClient.get<ApiResponse<Client>>(`/clientes/${id}`);
      return extractData(response);
    } catch (error) {
      return null;
    }
  }

  async searchCustomers(query: string): Promise<Client[]> {
    if (apiClient.shouldUseMocks()) {
      return mockApi.searchClients(query);
    }

    const response = await apiClient.get<ApiResponse<Client[]>>(`/clientes/search?q=${encodeURIComponent(query)}`);
    return extractData(response);
  }

  async createCustomer(customer: Omit<Client, 'id' | 'createdAt'>): Promise<Client> {
    if (apiClient.shouldUseMocks()) {
      return mockApi.createClient(customer);
    }

    const response = await apiClient.post<ApiResponse<Client>>('/clientes', customer);
    return extractData(response);
  }

  async updateCustomer(id: string, updates: Partial<Client>): Promise<Client> {
    if (apiClient.shouldUseMocks()) {
      const { mockClients } = await import('./mocks');
      const index = mockClients.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Cliente no encontrado');
      
      mockClients[index] = {
        ...mockClients[index],
        ...updates
      };
      return mockClients[index];
    }

    const response = await apiClient.put<ApiResponse<Client>>(`/clientes/${id}`, updates);
    return extractData(response);
  }

  async deleteCustomer(id: string): Promise<void> {
    if (apiClient.shouldUseMocks()) {
      const { mockClients } = await import('./mocks');
      const index = mockClients.findIndex(c => c.id === id);
      if (index !== -1) {
        mockClients.splice(index, 1);
      }
      return;
    }

    await apiClient.delete(`/clientes/${id}`);
  }

  async getCustomerPoints(id: string): Promise<number> {
    if (apiClient.shouldUseMocks()) {
      const client = await mockApi.getClientById(id);
      return client?.points || 0;
    }

    const response = await apiClient.get<ApiResponse<{ points: number }>>(`/clientes/${id}/points`);
    const data = extractData(response);
    return data.points;
  }

  async updateCustomerPoints(id: string, points: number): Promise<Client> {
    if (apiClient.shouldUseMocks()) {
      const { mockClients } = await import('./mocks');
      const index = mockClients.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Cliente no encontrado');
      
      mockClients[index].points = points;
      return mockClients[index];
    }

    const response = await apiClient.patch<ApiResponse<Client>>(`/clientes/${id}/points`, { points });
    return extractData(response);
  }

  async getTopCustomers(limit: number = 10): Promise<Client[]> {
    if (apiClient.shouldUseMocks()) {
      const clients = await mockApi.getClients();
      return clients
        .sort((a, b) => (b.points || 0) - (a.points || 0))
        .slice(0, limit);
    }

    const response = await apiClient.get<ApiResponse<Client[]>>(`/clientes/top?limit=${limit}`);
    return extractData(response);
  }

  async getCustomersByPointsRange(minPoints: number, maxPoints: number): Promise<Client[]> {
    if (apiClient.shouldUseMocks()) {
      const clients = await mockApi.getClients();
      return clients.filter(c => 
        (c.points || 0) >= minPoints && (c.points || 0) <= maxPoints
      );
    }

    const response = await apiClient.get<ApiResponse<Client[]>>(
      `/clientes/points-range?min=${minPoints}&max=${maxPoints}`
    );
    return extractData(response);
  }

  async validateCustomerPhone(phone: string): Promise<{ isValid: boolean; customer?: Client }> {
    if (apiClient.shouldUseMocks()) {
      const clients = await mockApi.getClients();
      const customer = clients.find(c => c.phone === phone);
      return {
        isValid: !!customer,
        customer: customer || undefined
      };
    }

    const response = await apiClient.get<ApiResponse<{ isValid: boolean; customer?: Client }>>(
      `/clientes/validate-phone?phone=${encodeURIComponent(phone)}`
    );
    return extractData(response);
  }

  async getCustomerStats(): Promise<{
    total: number;
    active: number;
    newThisMonth: number;
    averagePoints: number;
  }> {
    if (apiClient.shouldUseMocks()) {
      const clients = await mockApi.getClients();
      const total = clients.length;
      const active = clients.filter(c => c.isActive !== false).length;
      const averagePoints = clients.reduce((sum, c) => sum + (c.points || 0), 0) / total;
      
      return {
        total,
        active,
        newThisMonth: Math.floor(total * 0.1), // Simular 10% nuevos este mes
        averagePoints: Math.round(averagePoints)
      };
    }

    const response = await apiClient.get<ApiResponse<{
      total: number;
      active: number;
      newThisMonth: number;
      averagePoints: number;
    }>>('/clientes/stats');
    return extractData(response);
  }
}

// Exportar instancia singleton
export const customersService = CustomersService.getInstance(); 