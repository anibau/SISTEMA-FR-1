// Exportar todos los servicios
export { apiClient, extractData, extractDirectData, extractPaginatedData } from './api';
export { authService } from './auth.service';
export { productsService } from './products.service';
export { customersService } from './customers.service';
export { salesService } from './sales.service';
export { promotionsService } from './promotions.service';
export { cashService } from './cash.service';
export { expenseService } from './expense.service';
export { pointsService } from './points.service';
export { deliveryService } from './delivery.service';
export { configService } from './config.service';

// Exportar mocks para desarrollo
export { mockApi, mockProducts, mockClients, mockPromotions, mockSales } from './mocks';
export {
  mockCashRegisters,
  mockCashierShifts,
  mockExpenses,
  mockExpenseCategories,
  mockPointsConfig,
  mockPointsTransactions,
  mockCustomers,
  mockDeliveryZones,
  mockDeliveryPersons,
  mockDeliveryOrders,
  mockSystemConfig
} from './mock-data';