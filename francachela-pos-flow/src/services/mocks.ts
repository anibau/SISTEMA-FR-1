import { Product, Client, Sale, Promotion, User, LoginCredentials, AuthResponse } from '@/types/pos.types';
import {
  CashRegister,
  CashierShift,
  ShiftTransaction,
  Expense,
  ExpenseCategory,
  PointsTransaction,
  DeliveryZone,
  DeliveryOrder,
  DeliveryPerson
} from '@/types/system.types';
import {
  mockCashRegisters,
  mockCashierShifts,
  mockShiftTransactions,
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

// Simular delay para que parezca una API real
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock de productos
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Cerveza Cristal',
    price: 3.50,
    barcode: '7891234567890',
    stock: 50,
    category: 'Cerveza',
    image: '/placeholder.svg'
  },
  {
    id: '2',
    name: 'Pisco Quebranta',
    price: 25.00,
    barcode: '7891234567891',
    stock: 20,
    category: 'Pisco',
    image: '/placeholder.svg'
  },
  {
    id: '3',
    name: 'Vodka Absolut',
    price: 45.00,
    barcode: '7891234567892',
    stock: 15,
    category: 'Vodka',
    image: '/placeholder.svg'
  },
  {
    id: '4',
    name: 'Ron Bacardi',
    price: 35.00,
    barcode: '7891234567893',
    stock: 25,
    category: 'Ron',
    image: '/placeholder.svg'
  },
  {
    id: '5',
    name: 'Whisky Jack Daniels',
    price: 85.00,
    barcode: '7891234567894',
    stock: 10,
    category: 'Whisky',
    image: '/placeholder.svg'
  },
  {
    id: '6',
    name: 'Cerveza Pilsen',
    price: 3.00,
    barcode: '7891234567895',
    stock: 40,
    category: 'Cerveza',
    image: '/placeholder.svg'
  },
  {
    id: '7',
    name: 'Pisco Italia',
    price: 30.00,
    barcode: '7891234567896',
    stock: 18,
    category: 'Pisco',
    image: '/placeholder.svg'
  },
  {
    id: '8',
    name: 'Vodka Smirnoff',
    price: 40.00,
    barcode: '7891234567897',
    stock: 12,
    category: 'Vodka',
    image: '/placeholder.svg'
  }
];

// Mock de clientes
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    points: 150
  },
  {
    id: '2',
    name: 'María López',
    points: 320
  },
  {
    id: '3',
    name: 'Carlos Ruiz',
    points: 75
  },
  {
    id: '4',
    name: 'Ana García',
    points: 200
  },
  {
    id: '5',
    name: 'Luis Torres',
    points: 450
  }
];

// Mock de promociones
export const mockPromotions: Promotion[] = [
  {
    id: '1',
    name: '2x1 en Cervezas',
    description: 'Lleva 2 cervezas por el precio de 1',
    discountType: 'percentage',
    discountValue: 50,
    minQuantity: 2,
    applicableProducts: ['1', '6'], // IDs de productos
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    isActive: true
  },
  {
    id: '2',
    name: 'Descuento 10% en Piscos',
    description: '10% de descuento en toda la línea de piscos',
    discountType: 'percentage',
    discountValue: 10,
    minQuantity: 1,
    applicableProducts: ['2', '7'],
    validFrom: new Date('2024-01-01'),
    validTo: new Date('2024-12-31'),
    isActive: true
  }
];

// Mock de ventas
export const mockSales: Sale[] = [
  {
    id: '1',
    items: [
      { ...mockProducts[0], quantity: 2 },
      { ...mockProducts[1], quantity: 1 }
    ],
    total: 32.00,
    customer: 'Juan Pérez',
    paymentMethod: 'efectivo',
    status: 'completed',
    createdAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    items: [
      { ...mockProducts[2], quantity: 1 },
      { ...mockProducts[3], quantity: 1 }
    ],
    total: 80.00,
    customer: 'María López',
    paymentMethod: 'yape',
    status: 'completed',
    createdAt: new Date('2024-01-15T14:20:00')
  }
];

// Funciones mock para simular API calls
export const mockApi = {
  // Productos
  async getProducts(): Promise<Product[]> {
    await delay(300);
    return mockProducts;
  },

  async getProductById(id: string): Promise<Product | null> {
    await delay(200);
    return mockProducts.find(p => p.id === id) || null;
  },

  async searchProducts(query: string): Promise<Product[]> {
    await delay(250);
    return mockProducts.filter(p => 
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.barcode?.includes(query)
    );
  },

  async updateProductStock(id: string, newStock: number): Promise<Product> {
    await delay(400);
    const product = mockProducts.find(p => p.id === id);
    if (!product) throw new Error('Producto no encontrado');
    
    product.stock = newStock;
    return product;
  },

  // Clientes
  async getClients(): Promise<Client[]> {
    await delay(300);
    return mockClients;
  },

  async getClientById(id: string): Promise<Client | null> {
    await delay(200);
    return mockClients.find(c => c.id === id) || null;
  },

  async searchClients(query: string): Promise<Client[]> {
    await delay(250);
    return mockClients.filter(c => 
      c.name.toLowerCase().includes(query.toLowerCase())
    );
  },

  async createClient(client: Omit<Client, 'id'>): Promise<Client> {
    await delay(500);
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      points: client.points || 0
    };
    mockClients.push(newClient);
    return newClient;
  },

  // Ventas
  async createSale(sale: Omit<Sale, 'id' | 'createdAt'>): Promise<Sale> {
    await delay(800);
    const newSale: Sale = {
      ...sale,
      id: `S${Date.now()}`,
      createdAt: new Date()
    };
    mockSales.push(newSale);
    return newSale;
  },

  async getSales(): Promise<Sale[]> {
    await delay(400);
    return mockSales;
  },

  // Promociones
  async getPromotions(): Promise<Promotion[]> {
    await delay(300);
    return mockPromotions.filter(p => p.isActive);
  },

  // Autenticación
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(600);
    
    if (email === 'admin@francachela.com' && password === '123456') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '1',
          name: 'Administrador',
          email: 'admin@francachela.com',
          role: 'admin',
          isActive: true
        },
        expiresIn: 3600
      };
    }
    
    if (email === 'vendedor@francachela.com' && password === '123456') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '2',
          name: 'Vendedor',
          email: 'vendedor@francachela.com',
          role: 'vendedor',
          isActive: true
        },
        expiresIn: 3600
      };
    }
    
    if (email === 'cajero@francachela.com' && password === '123456') {
      return {
        token: 'mock-jwt-token-' + Date.now(),
        user: {
          id: '3',
          name: 'Cajero',
          email: 'cajero@francachela.com',
          role: 'cajero',
          isActive: true
        },
        expiresIn: 3600
      };
    }
    
    throw new Error('Credenciales inválidas');
  },

  async logout(): Promise<void> {
    await delay(200);
    // Simular logout
  },

  async getCurrentUser(): Promise<User | null> {
    await delay(500);
    
    // Simular obtener usuario actual desde localStorage
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    
    return null;
  },

  // === MÓDULO DE CAJAS Y TURNOS ===
  async getCashRegisters(): Promise<CashRegister[]> {
    await delay(300);
    return mockCashRegisters;
  },

  async getCashRegisterById(id: string): Promise<CashRegister | null> {
    await delay(200);
    return mockCashRegisters.find(r => r.id === id) || null;
  },

  async getCurrentShift(registerId?: string): Promise<CashierShift | null> {
    await delay(300);
    return mockCashierShifts.find(s => 
      (!registerId || s.registerId === registerId) && 
      s.status === 'active'
    ) || null;
  },

  async startShift(registerId: string, startAmount: number, notes?: string): Promise<CashierShift> {
    await delay(500);
    const user = await this.getCurrentUser();
    if (!user) throw new Error('No hay usuario autenticado');

    const newShift: CashierShift = {
      id: `shift${Date.now()}`,
      registerId,
      userId: user.id,
      userName: user.name,
      startAmount,
      startTime: new Date(),
      status: 'active',
      notes,
      transactions: []
    };

    mockCashierShifts.push(newShift);
    return newShift;
  },

  async endShift(shiftId: string, endAmount: number, notes?: string): Promise<CashierShift> {
    await delay(500);
    
    const shift = mockCashierShifts.find(s => s.id === shiftId);
    if (!shift) throw new Error('Turno no encontrado');
    if (shift.status !== 'active') throw new Error('No se puede cerrar un turno que no está activo');
    
    const transactions = this.getShiftTransactions(shiftId);
    const totalAmount = transactions.reduce((sum, t) => sum + t.amount, shift.startAmount);
    
    shift.endAmount = endAmount;
    shift.expectedEndAmount = totalAmount;
    shift.discrepancy = endAmount - totalAmount;
    shift.endTime = new Date();
    shift.status = 'closed';
    shift.notes = notes ? (shift.notes ? `${shift.notes}\n${notes}` : notes) : shift.notes;
    
    return shift;
  },

  async getShiftTransactions(shiftId: string): Promise<ShiftTransaction[]> {
    await delay(200);
    return mockShiftTransactions[shiftId] || [];
  },

  async addShiftTransaction(
    shiftId: string, 
    type: ShiftTransaction['type'],
    amount: number,
    paymentMethod: ShiftTransaction['paymentMethod'],
    description: string,
    reference?: string
  ): Promise<ShiftTransaction> {
    await delay(300);
    
    const shift = mockCashierShifts.find(s => s.id === shiftId);
    if (!shift) throw new Error('Turno no encontrado');
    if (shift.status !== 'active') throw new Error('No se pueden añadir transacciones a un turno cerrado');
    
    const newTransaction: ShiftTransaction = {
      id: `trans${Date.now()}`,
      shiftId,
      type,
      amount,
      paymentMethod,
      description,
      reference,
      timestamp: new Date()
    };
    
    if (!mockShiftTransactions[shiftId]) {
      mockShiftTransactions[shiftId] = [];
    }
    
    mockShiftTransactions[shiftId].push(newTransaction);
    return newTransaction;
  },

  async getShiftHistory(
    startDate?: Date, 
    endDate?: Date, 
    userId?: string, 
    registerId?: string,
    status?: CashierShift['status']
  ): Promise<CashierShift[]> {
    await delay(400);
    
    return mockCashierShifts.filter(shift => {
      let matches = true;
      
      if (startDate && shift.startTime < startDate) matches = false;
      if (endDate && shift.startTime > endDate) matches = false;
      if (userId && shift.userId !== userId) matches = false;
      if (registerId && shift.registerId !== registerId) matches = false;
      if (status && shift.status !== status) matches = false;
      
      return matches;
    });
  },

  async getCashReport(startDate?: Date, endDate?: Date, registerId?: string) {
    await delay(600);
    
    const shifts = await this.getShiftHistory(startDate, endDate, undefined, registerId);
    
    // Calcular totales para reporte
    const totalSales = shifts.reduce((sum, shift) => {
      const transactions = mockShiftTransactions[shift.id] || [];
      const salesAmount = transactions
        .filter(t => t.type === 'sale')
        .reduce((s, t) => s + t.amount, 0);
      return sum + salesAmount;
    }, 0);
    
    const totalExpenses = shifts.reduce((sum, shift) => {
      const transactions = mockShiftTransactions[shift.id] || [];
      const expensesAmount = transactions
        .filter(t => t.type === 'expense')
        .reduce((s, t) => s + t.amount, 0);
      return sum + expensesAmount;
    }, 0);
    
    const totalDiscrepancies = shifts
      .filter(s => s.status === 'closed' && s.discrepancy !== undefined)
      .reduce((sum, s) => sum + (s.discrepancy || 0), 0);
    
    return {
      period: {
        from: startDate || shifts.reduce((earliest, s) => 
          s.startTime < earliest ? s.startTime : earliest, 
          shifts[0]?.startTime || new Date()),
        to: endDate || new Date()
      },
      totalShifts: shifts.length,
      openShifts: shifts.filter(s => s.status === 'active').length,
      closedShifts: shifts.filter(s => s.status === 'closed').length,
      totalSales,
      totalExpenses,
      totalCash: totalSales - totalExpenses,
      totalDiscrepancies,
      byPaymentMethod: {
        efectivo: shifts.reduce((sum, shift) => {
          const transactions = mockShiftTransactions[shift.id] || [];
          return sum + transactions
            .filter(t => t.paymentMethod === 'efectivo')
            .reduce((s, t) => s + t.amount, 0);
        }, 0),
        yape: shifts.reduce((sum, shift) => {
          const transactions = mockShiftTransactions[shift.id] || [];
          return sum + transactions
            .filter(t => t.paymentMethod === 'yape')
            .reduce((s, t) => s + t.amount, 0);
        }, 0),
        plin: shifts.reduce((sum, shift) => {
          const transactions = mockShiftTransactions[shift.id] || [];
          return sum + transactions
            .filter(t => t.paymentMethod === 'plin')
            .reduce((s, t) => s + t.amount, 0);
        }, 0),
        transferencia: shifts.reduce((sum, shift) => {
          const transactions = mockShiftTransactions[shift.id] || [];
          return sum + transactions
            .filter(t => t.paymentMethod === 'transferencia')
            .reduce((s, t) => s + t.amount, 0);
        }, 0),
        tarjeta: shifts.reduce((sum, shift) => {
          const transactions = mockShiftTransactions[shift.id] || [];
          return sum + transactions
            .filter(t => t.paymentMethod === 'tarjeta')
            .reduce((s, t) => s + t.amount, 0);
        }, 0)
      }
    };
  },

  // === MÓDULO DE GASTOS ===
  async getExpenseCategories(): Promise<ExpenseCategory[]> {
    await delay(300);
    return mockExpenseCategories;
  },

  async getExpenses(startDate?: Date, endDate?: Date, categoryId?: string, approved?: boolean): Promise<Expense[]> {
    await delay(400);
    
    return mockExpenses.filter(expense => {
      let matches = true;
      
      if (startDate && expense.date < startDate) matches = false;
      if (endDate && expense.date > endDate) matches = false;
      if (categoryId && expense.category !== categoryId) matches = false;
      if (approved !== undefined && expense.approved !== approved) matches = false;
      
      return matches;
    });
  },

  async addExpense(expense: Omit<Expense, 'id'>): Promise<Expense> {
    await delay(500);
    
    const newExpense: Expense = {
      ...expense,
      id: `exp${Date.now()}`
    };
    
    mockExpenses.push(newExpense);
    return newExpense;
  },

  async approveExpense(id: string, approved: boolean): Promise<Expense> {
    await delay(300);
    
    const user = await this.getCurrentUser();
    if (!user) throw new Error('No hay usuario autenticado');
    
    const expense = mockExpenses.find(e => e.id === id);
    if (!expense) throw new Error('Gasto no encontrado');
    
    expense.approved = approved;
    expense.approvedBy = approved ? user.id : undefined;
    
    return expense;
  },

  // === MÓDULO DE PUNTOS ===
  async getPointsConfig() {
    await delay(200);
    return mockPointsConfig;
  },

  async getCustomersWithPoints() {
    await delay(300);
    return mockCustomers;
  },

  async getCustomerPoints(customerId: string) {
    await delay(300);
    
    const customer = mockCustomers.find(c => c.id === customerId);
    const transactions = mockPointsTransactions.filter(t => t.customerId === customerId);
    
    return {
      points: customer?.points || 0,
      transactions
    };
  },

  async getPointsTransactions(
    startDate?: Date, 
    endDate?: Date,
    customerId?: string,
    type?: 'add' | 'redeem'
  ) {
    await delay(400);
    
    return mockPointsTransactions.filter(t => {
      let matches = true;
      
      if (customerId && t.customerId !== customerId) matches = false;
      if (type && t.type !== type) matches = false;
      if (startDate && new Date(t.date) < startDate) matches = false;
      if (endDate && new Date(t.date) > endDate) matches = false;
      
      return matches;
    });
  },

  async createPointsTransaction(transaction: {
    customerId: string;
    type: 'add' | 'redeem';
    points: number;
    reason: string;
    description?: string;
  }): Promise<PointsTransaction> {
    await delay(400);
    
    const customer = mockCustomers.find(c => c.id === transaction.customerId);
    if (!customer) throw new Error('Cliente no encontrado');
    
    // Validar puntos suficientes para canje
    if (transaction.type === 'redeem' && customer.points < transaction.points) {
      throw new Error('Puntos insuficientes para canjear');
    }
    
    const newTransaction: PointsTransaction = {
      id: `pt${Date.now()}`,
      customerId: transaction.customerId,
      customerName: customer.name,
      type: transaction.type,
      points: transaction.points,
      reason: transaction.reason,
      description: transaction.description,
      date: new Date(),
      expiryDate: transaction.type === 'add' ? 
        new Date(Date.now() + (mockPointsConfig.pointsExpirationDays * 86400000)) : 
        undefined
    };
    
    // Actualizar puntos del cliente
    if (transaction.type === 'add') {
      customer.points += transaction.points;
    } else {
      customer.points -= transaction.points;
    }
    
    customer.lastPointsActivity = new Date();
    mockPointsTransactions.unshift(newTransaction);
    
    return newTransaction;
  },

  // === MÓDULO DE DELIVERY ===
  async getDeliveryZones(): Promise<DeliveryZone[]> {
    await delay(300);
    return mockDeliveryZones;
  },

  async getDeliveryPersons(available?: boolean): Promise<DeliveryPerson[]> {
    await delay(300);
    
    if (available !== undefined) {
      return mockDeliveryPersons.filter(dp => dp.isAvailable === available && dp.isActive);
    }
    
    return mockDeliveryPersons.filter(dp => dp.isActive);
  },

  async createDeliveryOrder(order: Omit<DeliveryOrder, 'id' | 'createdAt'>): Promise<DeliveryOrder> {
    await delay(500);
    
    const newOrder: DeliveryOrder = {
      ...order,
      id: `do${Date.now()}`,
      createdAt: new Date()
    };
    
    mockDeliveryOrders.push(newOrder);
    return newOrder;
  },

  async getDeliveryOrders(status?: DeliveryOrder['status']): Promise<DeliveryOrder[]> {
    await delay(400);
    
    if (status) {
      return mockDeliveryOrders.filter(o => o.status === status);
    }
    
    return mockDeliveryOrders;
  },

  async updateDeliveryOrderStatus(
    orderId: string, 
    status: DeliveryOrder['status'], 
    deliveryPersonId?: string
  ): Promise<DeliveryOrder> {
    await delay(300);
    
    const order = mockDeliveryOrders.find(o => o.id === orderId);
    if (!order) throw new Error('Pedido no encontrado');
    
    order.status = status;
    if (deliveryPersonId) {
      order.assignedTo = deliveryPersonId;
    }
    
    if (status === 'delivered') {
      order.actualDeliveryTime = new Date();
    }
    
    order.updatedAt = new Date();
    return order;
  }
}; 