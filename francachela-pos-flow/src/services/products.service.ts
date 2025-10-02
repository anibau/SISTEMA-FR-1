import { apiClient, extractData, extractPaginatedData } from './api';
import { mockApi } from './mocks';
import { 
  Product, 
  PaginationParams, 
  SearchFilters, 
  ApiResponse, 
  ProductCategory,
  ProductBrand,
  ProductSupplier,
  InventoryStats,
  BulkPriceUpdate,
  StockAdjustment
} from '@/types/pos.types';

export class ProductsService {
  private static instance: ProductsService;

  private constructor() {}

  static getInstance(): ProductsService {
    if (!ProductsService.instance) {
      ProductsService.instance = new ProductsService();
    }
    return ProductsService.instance;
  }

  /**
   * Obtiene una lista paginada y filtrada de productos
   */
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

    // Using a cast to match expected response type with pagination
    const response = await apiClient.get<ApiResponse<Product[]> & { pagination: any }>(`/productos?${queryParams}`);
    return {
      data: response.data.data,
      meta: response.data.pagination || response.data.meta
    };
  }

  /**
   * Obtiene un producto específico por su ID
   */
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

  /**
   * Busca productos por código o nombre (para POS)
   */
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
    // The response.data should already be a Blob when responseType is 'blob'
    // But we'll ensure it's properly typed
    return response.data as Blob;
  }

  /**
   * Obtiene los productos marcados como destacados (público)
   */
  async getFeaturedProducts(): Promise<Product[]> {
    if (apiClient.shouldUseMocks()) {
      const products = await mockApi.getProducts();
      return products.filter(p => p.isFeatured);
    }

    const response = await apiClient.get<ApiResponse<Product[]>>('/productos/featured');
    return extractData(response);
  }

  /**
   * Obtiene estadísticas generales del inventario (solo administradores)
   */
  async getInventoryStats(): Promise<InventoryStats> {
    if (apiClient.shouldUseMocks()) {
      const products = await mockApi.getProducts();
      
      return {
        totalProducts: products.length,
        totalCategories: new Set(products.map(p => p.category)).size,
        totalBrands: 5,
        totalSuppliers: 8,
        lowStockCount: products.filter(p => p.stock < 10).length,
        outOfStockCount: products.filter(p => p.stock === 0).length,
        averageCost: products.reduce((sum, p) => sum + (p.cost || 0), 0) / products.length,
        totalValue: products.reduce((sum, p) => sum + (p.cost || 0) * p.stock, 0),
        mostSoldProducts: [
          { id: "1", name: "Cerveza Pilsen 650ml", quantity: 120 },
          { id: "5", name: "Cerveza Corona 355ml", quantity: 85 },
          { id: "3", name: "Vodka Absolut 750ml", quantity: 42 }
        ]
      };
    }

    const response = await apiClient.get<ApiResponse<InventoryStats>>('/productos/stats');
    return extractData(response);
  }

  /**
   * Obtiene todas las categorías de productos disponibles
   */
  async getProductCategories(): Promise<ProductCategory[]> {
    if (apiClient.shouldUseMocks()) {
      return [
        { id: "1", name: "Cerveza", description: "Cervezas nacionales e importadas", isActive: true },
        { id: "2", name: "Pisco", description: "Piscos de distintas uvas y regiones", isActive: true },
        { id: "3", name: "Ron", description: "Ron nacional e importado", isActive: true },
        { id: "4", name: "Vodka", description: "Vodkas premium", isActive: true },
        { id: "5", name: "Whisky", description: "Whiskies importados", isActive: true },
        { id: "6", name: "Vino", description: "Vinos nacionales e importados", isActive: true },
        { id: "7", name: "Snacks", description: "Piqueos y snacks", isActive: false }
      ];
    }

    const response = await apiClient.get<ApiResponse<ProductCategory[]>>('/productos/categories/all');
    return extractData(response);
  }

  /**
   * Obtiene todas las marcas de productos disponibles
   */
  async getBrands(): Promise<ProductBrand[]> {
    if (apiClient.shouldUseMocks()) {
      return [
        { id: "1", name: "Backus", description: "Backus y Johnston", isActive: true },
        { id: "2", name: "Santiago Queirolo", description: "Vinos y piscos", isActive: true },
        { id: "3", name: "Pernod Ricard", description: "Licores importados", isActive: true },
        { id: "4", name: "Cartavio", description: "Ron nacional", isActive: true },
        { id: "5", name: "AB InBev", description: "Cervezas importadas", isActive: true }
      ];
    }

    const response = await apiClient.get<ApiResponse<ProductBrand[]>>('/productos/brands');
    return extractData(response);
  }

  /**
   * Obtiene todos los proveedores de productos (solo administradores)
   */
  async getSuppliers(): Promise<ProductSupplier[]> {
    if (apiClient.shouldUseMocks()) {
      return [
        { 
          id: "1", 
          name: "Distribuidora Central", 
          contactPerson: "Juan Pérez",
          phone: "987654321",
          email: "juanperez@distribuidora.com",
          address: "Av. Industrial 123",
          isActive: true 
        },
        { 
          id: "2", 
          name: "Importaciones del Sur", 
          contactPerson: "María López",
          phone: "987654322",
          email: "mlopez@importaciones.com",
          address: "Jr. Comercio 456",
          isActive: true 
        },
        { 
          id: "3", 
          name: "Mayorista Lima", 
          contactPerson: "Carlos Rodríguez",
          phone: "987654323",
          email: "crodriguez@mayorista.com",
          address: "Av. Argentina 789",
          isActive: false 
        }
      ];
    }

    const response = await apiClient.get<ApiResponse<ProductSupplier[]>>('/productos/suppliers');
    return extractData(response);
  }

  /**
   * Actualiza precios de productos en lote (solo administradores)
   */
  async bulkUpdatePrices(updateData: BulkPriceUpdate): Promise<{ updated: number; errors: string[] }> {
    if (apiClient.shouldUseMocks()) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { updated: updateData.productIds.length, errors: [] };
    }

    const response = await apiClient.post<ApiResponse<{ updated: number; errors: string[] }>>(
      '/productos/bulk-update-prices',
      updateData
    );
    return extractData(response);
  }

  /**
   * Obtiene productos con stock menor o igual al mínimo
   */
  async getLowStockProducts(includeOutOfStock: boolean = true): Promise<Product[]> {
    if (apiClient.shouldUseMocks()) {
      const products = await mockApi.getProducts();
      return products.filter(p => 
        (p.minStock && p.stock <= p.minStock) || 
        (includeOutOfStock && p.stock === 0)
      );
    }

    const response = await apiClient.get<ApiResponse<Product[]>>(
      `/productos/low-stock?includeOutOfStock=${includeOutOfStock}`
    );
    return extractData(response);
  }

  /**
   * Obtiene un producto específico por su código
   */
  async getProductByCode(code: string): Promise<Product | null> {
    if (apiClient.shouldUseMocks()) {
      const products = await mockApi.getProducts();
      return products.find(p => p.sku === code) || null;
    }

    try {
      const response = await apiClient.get<ApiResponse<Product>>(`/productos/code/${code}`);
      return extractData(response);
    } catch (error) {
      return null;
    }
  }

  /**
   * Registra un ajuste de stock
   */
  async adjustStock(adjustment: StockAdjustment): Promise<Product> {
    if (apiClient.shouldUseMocks()) {
      const { mockProducts } = await import('./mocks');
      const index = mockProducts.findIndex(p => p.id === adjustment.productId);
      
      if (index === -1) throw new Error('Producto no encontrado');
      
      mockProducts[index] = {
        ...mockProducts[index],
        stock: mockProducts[index].stock + adjustment.quantity,
        updatedAt: new Date()
      };
      
      return mockProducts[index];
    }

    const response = await apiClient.post<ApiResponse<Product>>(
      `/productos/${adjustment.productId}/adjust-stock`,
      adjustment
    );
    return extractData(response);
  }
}

// Exportar instancia singleton
export const productsService = ProductsService.getInstance(); 