import { apiClient, extractData, extractDirectData } from './api';
import { mockApi } from './mocks';
import { CashRegister, CashierShift, ShiftTransaction } from '@/types/system.types';

export class CashService {
  private static instance: CashService;

  private constructor() {}

  static getInstance(): CashService {
    if (!CashService.instance) {
      CashService.instance = new CashService();
    }
    return CashService.instance;
  }

  // === Gestión de Cajas ===
  async getRegisters() {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getCashRegisters();
    }

    const response = await apiClient.get<CashRegister[]>('/cash/registers');
    return extractDirectData(response);
  }

  async getRegisterById(id: string) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getCashRegisterById(id);
    }

    const response = await apiClient.get<CashRegister>(`/cash/registers/${id}`);
    return extractDirectData(response);
  }

  async createRegister(register: Omit<CashRegister, 'id' | 'createdAt'>) {
    if (apiClient.shouldUseMocks()) {
      return {
        ...register,
        id: `REG${Date.now()}`,
        createdAt: new Date()
      };
    }

    const response = await apiClient.post<CashRegister>('/cash/registers', register);
    return extractDirectData(response);
  }

  // === Gestión de Turnos ===
  async getCurrentShift(registerId?: string) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getCurrentShift(registerId);
    }

    const response = await apiClient.get<CashierShift>('/cash/shifts/current', {
      params: { registerId }
    });
    return extractDirectData(response);
  }

  async startShift(registerId: string, startAmount: number, notes?: string) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.startShift(registerId, startAmount, notes);
    }

    const response = await apiClient.post<CashierShift>('/cash/shifts/start', {
      registerId,
      startAmount,
      notes
    });
    return extractDirectData(response);
  }

  async endShift(shiftId: string, endAmount: number, notes?: string) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.endShift(shiftId, endAmount, notes);
    }

    const response = await apiClient.post<CashierShift>(`/cash/shifts/${shiftId}/end`, {
      endAmount,
      notes
    });
    return extractDirectData(response);
  }

  async getShiftTransactions(shiftId: string) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getShiftTransactions(shiftId);
    }

    const response = await apiClient.get<ShiftTransaction[]>(`/cash/shifts/${shiftId}/transactions`);
    return extractDirectData(response);
  }

  async addShiftTransaction(
    shiftId: string, 
    type: ShiftTransaction['type'],
    amount: number,
    paymentMethod: ShiftTransaction['paymentMethod'],
    description: string,
    reference?: string
  ) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.addShiftTransaction(shiftId, type, amount, paymentMethod, description, reference);
    }

    const response = await apiClient.post<ShiftTransaction>(`/cash/shifts/${shiftId}/transactions`, {
      type,
      amount,
      paymentMethod,
      description,
      reference
    });
    return extractDirectData(response);
  }

  // === Historial y Reportes ===
  async getShiftHistory(
    startDate?: Date, 
    endDate?: Date, 
    userId?: string, 
    registerId?: string,
    status?: CashierShift['status']
  ) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getShiftHistory(startDate, endDate, userId, registerId, status);
    }

    const response = await apiClient.get<CashierShift[]>('/cash/shifts/history', {
      params: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        userId,
        registerId,
        status
      }
    });
    return extractDirectData(response);
  }

  async getCashReport(
    startDate?: Date,
    endDate?: Date,
    registerId?: string
  ) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getCashReport(startDate, endDate, registerId);
    }

    const response = await apiClient.get('/cash/reports', {
      params: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        registerId
      }
    });
    return extractDirectData(response);
  }
}

export const cashService = CashService.getInstance();