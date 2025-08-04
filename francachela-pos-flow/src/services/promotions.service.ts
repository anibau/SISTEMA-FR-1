import { apiClient, extractData, extractPaginatedData } from './api';
import { mockApi } from './mocks';
import { Promotion, PaginationParams, ApiResponse } from '@/types/pos.types';

export class PromotionsService {
  private static instance: PromotionsService;

  private constructor() {}

  static getInstance(): PromotionsService {
    if (!PromotionsService.instance) {
      PromotionsService.instance = new PromotionsService();
    }
    return PromotionsService.instance;
  }

  async getPromotions(params?: PaginationParams): Promise<{ data: Promotion[]; meta?: any }> {
    if (apiClient.shouldUseMocks()) {
      const promotions = await mockApi.getPromotions();
      return { data: promotions };
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await apiClient.get<ApiResponse<Promotion[]>>(`/promociones?${queryParams}`);
    return extractPaginatedData(response);
  }

  async getPromotionById(id: string): Promise<Promotion | null> {
    if (apiClient.shouldUseMocks()) {
      const promotions = await mockApi.getPromotions();
      return promotions.find(p => p.id === id) || null;
    }

    try {
      const response = await apiClient.get<ApiResponse<Promotion>>(`/promociones/${id}`);
      return extractData(response);
    } catch (error) {
      return null;
    }
  }

  async createPromotion(promotion: Omit<Promotion, 'id'>): Promise<Promotion> {
    if (apiClient.shouldUseMocks()) {
      const newPromotion: Promotion = {
        ...promotion,
        id: Date.now().toString()
      };
      const { mockPromotions } = await import('./mocks');
      mockPromotions.push(newPromotion);
      return newPromotion;
    }

    const response = await apiClient.post<ApiResponse<Promotion>>('/promociones', promotion);
    return extractData(response);
  }

  async updatePromotion(id: string, updates: Partial<Promotion>): Promise<Promotion> {
    if (apiClient.shouldUseMocks()) {
      const { mockPromotions } = await import('./mocks');
      const index = mockPromotions.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Promoción no encontrada');
      
      mockPromotions[index] = {
        ...mockPromotions[index],
        ...updates
      };
      return mockPromotions[index];
    }

    const response = await apiClient.put<ApiResponse<Promotion>>(`/promociones/${id}`, updates);
    return extractData(response);
  }

  async deletePromotion(id: string): Promise<void> {
    if (apiClient.shouldUseMocks()) {
      const { mockPromotions } = await import('./mocks');
      const index = mockPromotions.findIndex(p => p.id === id);
      if (index !== -1) {
        mockPromotions.splice(index, 1);
      }
      return;
    }

    await apiClient.delete(`/promociones/${id}`);
  }

  async getActivePromotions(): Promise<Promotion[]> {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getPromotions();
    }

    const response = await apiClient.get<ApiResponse<Promotion[]>>('/promociones/active');
    return extractData(response);
  }

  async getPromotionsByProduct(productId: string): Promise<Promotion[]> {
    if (apiClient.shouldUseMocks()) {
      const promotions = await mockApi.getPromotions();
      return promotions.filter(p => p.applicableProducts.includes(productId));
    }

    const response = await apiClient.get<ApiResponse<Promotion[]>>(`/promociones/product/${productId}`);
    return extractData(response);
  }

  async applyPromotionToCart(
    promotionId: string, 
    items: Array<{ productId: string; quantity: number; price: number }>
  ): Promise<{
    discountAmount: number;
    finalTotal: number;
    appliedItems: Array<{ productId: string; quantity: number; originalPrice: number; finalPrice: number }>;
  }> {
    if (apiClient.shouldUseMocks()) {
      const promotion = await this.getPromotionById(promotionId);
      if (!promotion) throw new Error('Promoción no encontrada');

      let discountAmount = 0;
      const appliedItems = items
        .filter(item => promotion.applicableProducts.includes(item.productId))
        .map(item => {
          let finalPrice = item.price;
          
          if (promotion.discountType === 'percentage') {
            finalPrice = item.price * (1 - promotion.discountValue / 100);
            discountAmount += (item.price - finalPrice) * item.quantity;
          } else if (promotion.discountType === 'fixed') {
            finalPrice = Math.max(0, item.price - promotion.discountValue);
            discountAmount += (item.price - finalPrice) * item.quantity;
          }

          return {
            productId: item.productId,
            quantity: item.quantity,
            originalPrice: item.price,
            finalPrice
          };
        });

      const originalTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      const finalTotal = originalTotal - discountAmount;

      return {
        discountAmount,
        finalTotal,
        appliedItems
      };
    }

    const response = await apiClient.post<ApiResponse<{
      discountAmount: number;
      finalTotal: number;
      appliedItems: Array<{ productId: string; quantity: number; originalPrice: number; finalPrice: number }>;
    }>>(`/promociones/${promotionId}/apply`, { items });
    return extractData(response);
  }

  async validatePromotion(promotionId: string, cartItems: Array<{ productId: string; quantity: number }>): Promise<{
    isValid: boolean;
    reason?: string;
    applicableItems: string[];
  }> {
    if (apiClient.shouldUseMocks()) {
      const promotion = await this.getPromotionById(promotionId);
      if (!promotion) {
        return { isValid: false, reason: 'Promoción no encontrada', applicableItems: [] };
      }

      const now = new Date();
      if (now < promotion.validFrom || now > promotion.validTo) {
        return { isValid: false, reason: 'Promoción fuera de vigencia', applicableItems: [] };
      }

      if (!promotion.isActive) {
        return { isValid: false, reason: 'Promoción inactiva', applicableItems: [] };
      }

      const applicableItems = cartItems
        .filter(item => promotion.applicableProducts.includes(item.productId))
        .map(item => item.productId);

      if (applicableItems.length === 0) {
        return { isValid: false, reason: 'No hay productos aplicables', applicableItems: [] };
      }

      const totalQuantity = cartItems
        .filter(item => promotion.applicableProducts.includes(item.productId))
        .reduce((sum, item) => sum + item.quantity, 0);

      if (promotion.minQuantity && totalQuantity < promotion.minQuantity) {
        return { 
          isValid: false, 
          reason: `Mínimo ${promotion.minQuantity} unidades requeridas`, 
          applicableItems 
        };
      }

      return { isValid: true, applicableItems };
    }

    const response = await apiClient.post<ApiResponse<{
      isValid: boolean;
      reason?: string;
      applicableItems: string[];
    }>>(`/promociones/${promotionId}/validate`, { cartItems });
    return extractData(response);
  }

  async getPromotionStats(): Promise<{
    total: number;
    active: number;
    expiringSoon: number;
    mostUsed: Array<{ id: string; name: string; uses: number }>;
  }> {
    if (apiClient.shouldUseMocks()) {
      const promotions = await mockApi.getPromotions();
      const total = promotions.length;
      const active = promotions.filter(p => p.isActive).length;
      const now = new Date();
      const expiringSoon = promotions.filter(p => {
        const daysUntilExpiry = (p.validTo.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);
        return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
      }).length;

      const mostUsed = [
        { id: '1', name: '2x1 en Cervezas', uses: 45 },
        { id: '2', name: 'Descuento 10% en Piscos', uses: 32 }
      ];

      return {
        total,
        active,
        expiringSoon,
        mostUsed
      };
    }

    const response = await apiClient.get<ApiResponse<{
      total: number;
      active: number;
      expiringSoon: number;
      mostUsed: Array<{ id: string; name: string; uses: number }>;
    }>>('/promociones/stats');
    return extractData(response);
  }

  async togglePromotionStatus(id: string): Promise<Promotion> {
    if (apiClient.shouldUseMocks()) {
      const { mockPromotions } = await import('./mocks');
      const index = mockPromotions.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Promoción no encontrada');
      
      mockPromotions[index].isActive = !mockPromotions[index].isActive;
      return mockPromotions[index];
    }

    const response = await apiClient.patch<ApiResponse<Promotion>>(`/promociones/${id}/toggle`);
    return extractData(response);
  }
}

// Exportar instancia singleton
export const promotionsService = PromotionsService.getInstance(); 