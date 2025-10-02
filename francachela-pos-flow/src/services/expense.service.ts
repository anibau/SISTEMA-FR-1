import { apiClient, extractData, extractDirectData } from './api';
import { mockApi } from './mocks';
import { Expense, ExpenseCategory } from '@/types/system.types';

export class ExpenseService {
  private static instance: ExpenseService;

  private constructor() {}

  static getInstance(): ExpenseService {
    if (!ExpenseService.instance) {
      ExpenseService.instance = new ExpenseService();
    }
    return ExpenseService.instance;
  }

  async getExpenseCategories() {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getExpenseCategories();
    }

    const response = await apiClient.get<ExpenseCategory[]>('/expenses/categories');
    return extractDirectData(response);
  }

  async createExpenseCategory(category: Omit<ExpenseCategory, 'id'>) {
    if (apiClient.shouldUseMocks()) {
      const newCategory: ExpenseCategory = {
        ...category,
        id: `cat${Date.now()}`
      };
      return newCategory;
    }

    const response = await apiClient.post<ExpenseCategory>('/expenses/categories', category);
    return extractDirectData(response);
  }

  async getExpenses(startDate?: Date, endDate?: Date, categoryId?: string, approved?: boolean) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getExpenses(startDate, endDate, categoryId, approved);
    }

    const response = await apiClient.get<Expense[]>('/expenses', {
      params: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
        categoryId,
        approved
      }
    });
    return extractDirectData(response);
  }

  async getExpenseById(id: string) {
    if (apiClient.shouldUseMocks()) {
      const expenses = await mockApi.getExpenses();
      return expenses.find(e => e.id === id) || null;
    }

    const response = await apiClient.get<Expense>(`/expenses/${id}`);
    return extractDirectData(response);
  }

  async createExpense(expense: Omit<Expense, 'id'>) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.addExpense(expense);
    }

    const response = await apiClient.post<Expense>('/expenses', expense);
    return extractDirectData(response);
  }

  async updateExpense(id: string, data: Partial<Expense>) {
    if (apiClient.shouldUseMocks()) {
      const expenses = await mockApi.getExpenses();
      const expense = expenses.find(e => e.id === id);
      if (!expense) throw new Error('Gasto no encontrado');
      
      const updatedExpense = { ...expense, ...data };
      return updatedExpense;
    }

    const response = await apiClient.put<Expense>(`/expenses/${id}`, data);
    return extractDirectData(response);
  }

  async approveExpense(id: string, approved: boolean) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.approveExpense(id, approved);
    }

    const response = await apiClient.patch<Expense>(`/expenses/${id}/approve`, { approved });
    return extractDirectData(response);
  }

  async deleteExpense(id: string) {
    if (apiClient.shouldUseMocks()) {
      // En mock simplemente retornamos true
      return true;
    }

    await apiClient.delete(`/expenses/${id}`);
    return true;
  }

  async uploadReceipt(id: string, file: File) {
    if (apiClient.shouldUseMocks()) {
      // Simular URL del recibo
      return { receiptUrl: `mock-receipt-${Date.now()}.jpg` };
    }

    const formData = new FormData();
    formData.append('receipt', file);

    const response = await apiClient.post(`/expenses/${id}/receipt`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return extractDirectData(response);
  }
}

export const expenseService = ExpenseService.getInstance();