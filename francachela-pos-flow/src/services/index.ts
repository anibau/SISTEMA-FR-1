// Exportar todos los servicios
export { apiClient, extractData, extractPaginatedData } from './api';
export { authService } from './auth.service';
export { productsService } from './products.service';
export { customersService } from './customers.service';
export { salesService } from './sales.service';
export { promotionsService } from './promotions.service';

// Exportar mocks para desarrollo
export { mockApi, mockProducts, mockClients, mockPromotions, mockSales } from './mocks'; 