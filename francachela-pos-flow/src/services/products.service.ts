import { apiClient, extractData, extractPaginatedData } from './api';
import { mockApi } from './mocks';
import { Product, PaginationParams, SearchFilters, ApiResponse } from '@/types/pos.types';

export class ProductsService {
  private static instance: ProductsService;

  private constructor() {}

  static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  async getProducts(params?: PaginationParams): Promise<{ data: Product[]; meta?: any }> {
    if (apiClient.shouldUseMocks()) {
      const products = await mockApi.getProducts();
      return { data: products };
    }

    const queryParams = new URLSearchParams();
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    if (params?.search) queryParams.append('search', params.search);
    if (params?.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params?.sortOrder) queryParams.append('sortOrder', params.sortOrder);

    const response = await apiClient.get<ApiResponse<Product[]>>(`/productos?${queryParams}`);
    return extractPaginatedData(response);
  }

  async getProductById(id: string): Promise<Product | null> {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getProductById(id);
    }

    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/productos/${id}`);
      return extractData(response);
    } catch (error) {
      return null;
    }
  }

  async searchProducts(query: string, filters?: SearchFilters): Promise<Product[]> {
    if (apiClient.shouldUseMocks()) {
      return mockApi.searchProducts(query);
    }

    const queryParams = new URLSearchParams({ search: query });
    if (filters?.category) queryParams.append('category', filters.category);
    if (filters?.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters?.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters?.inStock !== undefined) queryParams.append('inStock', filters.inStock.toString());
    if (filters?.isActive !== undefined) queryParams.append('isActive', filters.isActive.toString());

    const response = await apiClient.get<ApiResponse<Product[]>>(`/productos/search?${queryParams}`);
    return extractData(response);
  }

  async getProductByBarcode(barcode: string): Promise<Product | null> {
    if (apiClient.shouldUseMocks()) {
      const products = await mockApi.getProducts();
      return products.find(p => p.barcode === barcode) || null;
    }

    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/productos/barcode/${barcode}`);
      return extractData(response);
    } catch (error) {
      return null;
    }
  }

  async createProduct(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    if (apiClient.shouldUseMocks()) {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      // En mocks, agregar a la lista
      const { mockProducts } = await import('./mocks');
      mockProducts.push(newProduct);
      return newProduct;
    }

    const response = await apiClient.post<ApiResponse<Product>>('/productos', product);
    return extractData(response);
  }

  async updateProduct(id: string, updates: Partial<Product>): Promise<Product> {
    if (apiClient.shouldUseMocks()) {
      const { mockProducts } = await import('./mocks');
      const index = mockProducts.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Producto no encontrado');
      
      mockProducts[index] = {
        ...mockProducts[index],
        ...updates,
        updatedAt: new Date()
      };
      return mockProducts[index];
    }

    const response = await apiClient.put<ApiResponse<Product>>(`/productos/${id}`, updates);
    return extractData(response);
  }

  async deleteProduct(id: string): Promise<void> {
    if (apiClient.shouldUseMocks()) {
      const { mockProducts } = await import('./mocks');
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
      }
      return;
    }

    await apiClient.delete(`/productos/${id}`);
  }

  async updateStock(id: string, newStock: number): Promise<Product> {
    if (apiClient.shouldUseMocks()) {
      return mockApi.updateProductStock(id, newStock);
    }

    const response = await apiClient.patch<ApiResponse<Product>>(`/productos/${id}/stock`, {
      stock: newStock
    });
    return extractData(response);
  }

  async getLowStockProducts(threshold: number = 10): Promise<Product[]> {
    if (apiClient.shouldUseMocks()) {
      const products = await mockApi.getProducts();
      return products.filter(p => p.stock <= threshold);
    }

    const response = await apiClient.get<ApiResponse<Product[]>>(`/productos/low-stock?threshold=${threshold}`);
    return extractData(response);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    if (apiClient.shouldUseMocks()) {
      const products = await mockApi.getProducts();
      return products.filter(p => p.category === category);
    }

    const response = await apiClient.get<ApiResponse<Product[]>>(`/productos/category/${category}`);
    return extractData(response);
  }

  async getCategories(): Promise<string[]> {
    if (apiClient.shouldUseMocks()) {
      const products = await mockApi.getProducts();
      const categories = [...new Set(products.map(p => p.category))];
      return categories.sort();
    }

    const response = await apiClient.get<ApiResponse<string[]>>('/productos/categories');
    return extractData(response);
  }

  async importProducts(file: File): Promise<{ success: number; errors: string[] }> {
    if (apiClient.shouldUseMocks()) {
      // Simular importación
      await new Promise(resolve => setTimeout(resolve, 2000));
      return { success: 5, errors: [] };
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post<ApiResponse<{ success: number; errors: string[] }>>(
      '/productos/import',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return extractData(response);
  }

  async exportProducts(format: 'excel' | 'csv' = 'excel'): Promise<Blob> {
    if (apiClient.shouldUseMocks()) {
      // Simular exportación
      const products = await mockApi.getProducts();
      const csvContent = products.map(p => 
        `${p.id},${p.name},${p.price},${p.stock},${p.category}`
      ).join('\n');
      
      return new Blob([csvContent], { type: 'text/csv' });
    }

    const response = await apiClient.get(`/productos/export?format=${format}`, {
      responseType: 'blob'
    });
    return response.data;
  }
}

// Exportar instancia singleton
export const productsService = ProductsService.getInstance(); 