import { apiClient, extractData, extractPaginatedData, PaginatedResponse } from './api';
import { mockApi } from './mocks';
import { Sale, PaginationParams, ApiResponse } from '@/types/pos.types';

export class SalesService {
  private static instance: SalesService;

  private constructor() {}

  static getInstance(): SalesService {
    if (!SalesService.instance) {
      SalesService.instance = new SalesService();
    }
    return SalesService.instance;
  }

  async getSales(params?: PaginationParams): Promise<{ data: Sale[]; meta?: any }> {
    if (apiClient.shouldUseMocks()) {
      const sales = await mockApi.getSales();
      return { data: sales };
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await apiClient.get<PaginatedResponse<Sale>>(`/ventas?${queryParams}`);
    return extractPaginatedData(response);
  }

  async getSaleById(id: string): Promise<Sale | null> {
    if (apiClient.shouldUseMocks()) {
      const sales = await mockApi.getSales();
      return sales.find(s => s.id === id) || null;
    }

    try {
      const response = await apiClient.get<ApiResponse<Sale>>(`/ventas/${id}`);
      return extractData(response);
    } catch (error) {
      return null;
    }
  }

  async createSale(sale: Omit<Sale, 'id' | 'createdAt'>): Promise<Sale> {
    if (apiClient.shouldUseMocks()) {
      return mockApi.createSale(sale);
    }

    const response = await apiClient.post<ApiResponse<Sale>>('/ventas', sale);
    return extractData(response);
  }

  async updateSale(id: string, updates: Partial<Sale>): Promise<Sale> {
    if (apiClient.shouldUseMocks()) {
      const { mockSales } = await import('./mocks');
      const index = mockSales.findIndex(s => s.id === id);
      if (index === -1) throw new Error('Venta no encontrada');
      
      mockSales[index] = {
        ...mockSales[index],
        ...updates
      };
      return mockSales[index];
    }

    const response = await apiClient.put<ApiResponse<Sale>>(`/ventas/${id}`, updates);
    return extractData(response);
  }

  async deleteSale(id: string): Promise<void> {
    if (apiClient.shouldUseMocks()) {
      const { mockSales } = await import('./mocks');
      const index = mockSales.findIndex(s => s.id === id);
      if (index !== -1) {
        mockSales.splice(index, 1);
      }
      return;
    }

    await apiClient.delete(`/ventas/${id}`);
  }

  async completeSale(id: string, paymentMethod: string): Promise<Sale> {
    if (apiClient.shouldUseMocks()) {
      const { mockSales } = await import('./mocks');
      const index = mockSales.findIndex(s => s.id === id);
      if (index === -1) throw new Error('Venta no encontrada');
      
      mockSales[index] = {
        ...mockSales[index],
        status: 'completed',
        paymentMethod: paymentMethod as any
      };
      return mockSales[index];
    }

    const response = await apiClient.post<ApiResponse<Sale>>(`/ventas/${id}/complete`, {
      paymentMethod
    });
    return extractData(response);
  }

  async getSalesByDateRange(startDate: Date, endDate: Date): Promise<Sale[]> {
    if (apiClient.shouldUseMocks()) {
      const sales = await mockApi.getSales();
      return sales.filter(s => 
        s.createdAt >= startDate && s.createdAt <= endDate
      );
    }

    const response = await apiClient.get<ApiResponse<Sale[]>>(
      `/ventas/date-range?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
    );
    return extractData(response);
  }

  async getSalesByCustomer(customerId: string): Promise<Sale[]> {
    if (apiClient.shouldUseMocks()) {
      const sales = await mockApi.getSales();
      return sales.filter(s => s.customer === customerId);
    }

    const response = await apiClient.get<ApiResponse<Sale[]>>(`/ventas/customer/${customerId}`);
    return extractData(response);
  }

  async getSalesStats(startDate?: Date, endDate?: Date): Promise<{
    totalSales: number;
    totalRevenue: number;
    averageTicket: number;
    totalItems: number;
    topProducts: Array<{ productId: string; quantity: number; revenue: number }>;
  }> {
    if (apiClient.shouldUseMocks()) {
      const sales = await mockApi.getSales();
      const totalSales = sales.length;
      const totalRevenue = sales.reduce((sum, s) => sum + s.total, 0);
      const totalItems = sales.reduce((sum, s) => sum + s.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0);
      
      // Simular productos top
      const topProducts = [
        { productId: '1', quantity: 25, revenue: 87.50 },
        { productId: '2', quantity: 15, revenue: 375.00 },
        { productId: '3', quantity: 8, revenue: 360.00 }
      ];

      return {
        totalSales,
        totalRevenue,
        averageTicket: totalSales > 0 ? totalRevenue / totalSales : 0,
        totalItems,
        topProducts
      };
    }

    const queryParams = new URLSearchParams();
    if (startDate) queryParams.append('startDate', startDate.toISOString());
    if (endDate) queryParams.append('endDate', endDate.toISOString());

    const response = await apiClient.get<ApiResponse<{
      totalSales: number;
      totalRevenue: number;
      averageTicket: number;
      totalItems: number;
      topProducts: Array<{ productId: string; quantity: number; revenue: number }>;
    }>>(`/ventas/stats?${queryParams}`);
    return extractData(response);
  }

  async getDailySalesReport(date: Date): Promise<{
    date: string;
    totalSales: number;
    totalRevenue: number;
    salesByHour: Array<{ hour: number; sales: number; revenue: number }>;
  }> {
    if (apiClient.shouldUseMocks()) {
      const sales = await mockApi.getSales();
      const daySales = sales.filter(s => 
        s.createdAt.toDateString() === date.toDateString()
      );
      
      const totalSales = daySales.length;
      const totalRevenue = daySales.reduce((sum, s) => sum + s.total, 0);
      
      // Simular ventas por hora
      const salesByHour = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        sales: Math.floor(Math.random() * 5),
        revenue: Math.floor(Math.random() * 100)
      }));

      return {
        date: date.toISOString().split('T')[0],
        totalSales,
        totalRevenue,
        salesByHour
      };
    }

    const response = await apiClient.get<ApiResponse<{
      date: string;
      totalSales: number;
      totalRevenue: number;
      salesByHour: Array<{ hour: number; sales: number; revenue: number }>;
    }>>(`/ventas/daily-report?date=${date.toISOString().split('T')[0]}`);
    return extractData(response);
  }

  async getMonthlySalesReport(year: number, month: number): Promise<{
    year: number;
    month: number;
    totalSales: number;
    totalRevenue: number;
    salesByDay: Array<{ day: number; sales: number; revenue: number }>;
  }> {
    if (apiClient.shouldUseMocks()) {
      const sales = await mockApi.getSales();
      const monthSales = sales.filter(s => {
        const saleDate = s.createdAt;
        return saleDate.getFullYear() === year && saleDate.getMonth() === month - 1;
      });
      
      const totalSales = monthSales.length;
      const totalRevenue = monthSales.reduce((sum, s) => sum + s.total, 0);
      
      // Simular ventas por día
      const daysInMonth = new Date(year, month, 0).getDate();
      const salesByDay = Array.from({ length: daysInMonth }, (_, day) => ({
        day: day + 1,
        sales: Math.floor(Math.random() * 10),
        revenue: Math.floor(Math.random() * 500)
      }));

      return {
        year,
        month,
        totalSales,
        totalRevenue,
        salesByDay
      };
    }

    const response = await apiClient.get<ApiResponse<{
      year: number;
      month: number;
      totalSales: number;
      totalRevenue: number;
      salesByDay: Array<{ day: number; sales: number; revenue: number }>;
    }>>(`/ventas/monthly-report?year=${year}&month=${month}`);
    return extractData(response);
  }

  async exportSales(format: 'excel' | 'csv' = 'excel', filters?: {
    startDate?: Date;
    endDate?: Date;
    customerId?: string;
    status?: string;
  }): Promise<Blob> {
    if (apiClient.shouldUseMocks()) {
      // Simular exportación
      const sales = await mockApi.getSales();
      const csvContent = sales.map(s => 
        `${s.id},${s.customer},${s.total},${s.paymentMethod},${s.status},${s.createdAt}`
      ).join('\n');
      
      return new Blob([csvContent], { type: 'text/csv' });
    }

    const queryParams = new URLSearchParams({ format });
    if (filters?.startDate) queryParams.append('startDate', filters.startDate.toISOString());
    if (filters?.endDate) queryParams.append('endDate', filters.endDate.toISOString());
    if (filters?.customerId) queryParams.append('customerId', filters.customerId);
    if (filters?.status) queryParams.append('status', filters.status);

    const response = await apiClient.get<Blob>(`/ventas/export?${queryParams}`, {
      responseType: 'blob'
    });
    return response.data as Blob;
  }
}

// Exportar instancia singleton
export const salesService = SalesService.getInstance(); 