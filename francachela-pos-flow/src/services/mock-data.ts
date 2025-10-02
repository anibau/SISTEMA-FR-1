import { 
  CashRegister, 
  CashierShift, 
  ShiftTransaction, 
  Expense, 
  ExpenseCategory, 
  PointsConfig, 
  PointsTransaction,
  Customer,
  DeliveryZone,
  DeliveryOrder,
  DeliveryPerson,
  SystemConfig
} from '@/types/system.types';

// Mock para cajas registradoras
export const mockCashRegisters: CashRegister[] = [
  {
    id: 'reg1',
    name: 'Caja Principal',
    location: 'Mostrador Principal',
    isActive: true,
    createdAt: new Date('2024-01-01')
  },
  {
    id: 'reg2',
    name: 'Caja Secundaria',
    location: 'Segundo Piso',
    isActive: true,
    createdAt: new Date('2024-01-01')
  }
];

// Mock para turnos de cajero
export const mockCashierShifts: CashierShift[] = [
  {
    id: 'shift1',
    registerId: 'reg1',
    userId: '1',
    userName: 'Administrador',
    startAmount: 500,
    startTime: new Date('2024-10-01T08:00:00'),
    status: 'active',
    transactions: []
  },
  {
    id: 'shift2',
    registerId: 'reg2',
    userId: '3',
    userName: 'Cajero',
    startAmount: 300,
    endAmount: 1250.50,
    expectedEndAmount: 1260,
    discrepancy: -9.50,
    startTime: new Date('2024-09-30T08:00:00'),
    endTime: new Date('2024-09-30T17:00:00'),
    status: 'closed',
    notes: 'Cierre normal de turno',
    transactions: []
  }
];

// Mock para transacciones de turno
export const mockShiftTransactions: Record<string, ShiftTransaction[]> = {
  'shift1': [
    {
      id: 'trans1',
      shiftId: 'shift1',
      type: 'sale',
      amount: 75.50,
      paymentMethod: 'efectivo',
      description: 'Venta #V12345',
      timestamp: new Date('2024-10-01T10:15:00')
    },
    {
      id: 'trans2',
      shiftId: 'shift1',
      type: 'expense',
      amount: -20,
      paymentMethod: 'efectivo',
      description: 'Compra de bolsas',
      timestamp: new Date('2024-10-01T11:30:00')
    }
  ],
  'shift2': [
    {
      id: 'trans3',
      shiftId: 'shift2',
      type: 'sale',
      amount: 120,
      paymentMethod: 'yape',
      description: 'Venta #V12340',
      timestamp: new Date('2024-09-30T09:15:00')
    },
    {
      id: 'trans4',
      shiftId: 'shift2',
      type: 'sale',
      amount: 85,
      paymentMethod: 'tarjeta',
      description: 'Venta #V12341',
      timestamp: new Date('2024-09-30T10:20:00')
    },
    {
      id: 'trans5',
      shiftId: 'shift2',
      type: 'withdrawal',
      amount: -50,
      paymentMethod: 'efectivo',
      description: 'Retiro para caja chica',
      reference: 'RETIRO-001',
      timestamp: new Date('2024-09-30T14:45:00')
    }
  ]
};

// Mock para categorías de gastos
export const mockExpenseCategories: ExpenseCategory[] = [
  {
    id: 'cat1',
    name: 'Suministros',
    description: 'Material de oficina, limpieza, etc.',
    budget: 500,
    budgetPeriod: 'monthly'
  },
  {
    id: 'cat2',
    name: 'Servicios',
    description: 'Internet, luz, agua, etc.',
    budget: 1000,
    budgetPeriod: 'monthly'
  },
  {
    id: 'cat3',
    name: 'Transporte',
    description: 'Combustible, mantenimiento, etc.',
    budget: 300,
    budgetPeriod: 'monthly'
  },
  {
    id: 'cat4',
    name: 'Marketing',
    description: 'Publicidad, promociones, etc.',
    budget: 800,
    budgetPeriod: 'monthly'
  }
];

// Mock para gastos
export const mockExpenses: Expense[] = [
  {
    id: 'exp1',
    amount: 150,
    category: 'Servicios',
    description: 'Pago de internet',
    date: new Date('2024-09-15'),
    paymentMethod: 'efectivo',
    approved: true,
    approvedBy: '1',
    tags: ['internet', 'mensual']
  },
  {
    id: 'exp2',
    amount: 75.50,
    category: 'Suministros',
    description: 'Compra de material de limpieza',
    date: new Date('2024-09-20'),
    paymentMethod: 'efectivo',
    approved: true,
    approvedBy: '1'
  },
  {
    id: 'exp3',
    amount: 200,
    category: 'Marketing',
    description: 'Impresión de volantes promocionales',
    date: new Date('2024-09-25'),
    paymentMethod: 'transferencia',
    approved: false,
    tags: ['promoción', 'marketing']
  }
];

// Mock para clientes con puntos
export const mockCustomers: Customer[] = [
  {
    id: 'customer1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    phone: '987654321',
    points: 250,
    lastPointsActivity: new Date('2024-09-20'),
    memberSince: new Date('2023-05-15')
  },
  {
    id: 'customer2',
    name: 'María López',
    email: 'maria@example.com',
    phone: '987654322',
    points: 180,
    lastPointsActivity: new Date('2024-09-15'),
    memberSince: new Date('2023-08-10'),
    birthdate: new Date('1990-07-15')
  },
  {
    id: 'customer3',
    name: 'Carlos Ruiz',
    phone: '987654323',
    points: 50,
    lastPointsActivity: new Date('2024-09-25'),
    memberSince: new Date('2024-01-20')
  },
  {
    id: 'customer4',
    name: 'Ana Torres',
    email: 'ana@example.com',
    points: 320,
    lastPointsActivity: new Date('2024-09-18'),
    memberSince: new Date('2023-03-05'),
    birthdate: new Date('1985-03-22')
  }
];

// Mock para configuración de puntos
export const mockPointsConfig: PointsConfig = {
  id: 'points1',
  pointsPerPurchaseAmount: 10, // 1 punto por cada 10 soles
  pointsExpirationDays: 365, // Expiran en 1 año
  minimumRedeemPoints: 100, // Mínimo 100 puntos para redimir
  pointValueInCurrency: 0.5, // Cada punto vale 0.50 soles
  welcomePoints: 50, // Puntos por registro
  birthdayPoints: 100, // Puntos por cumpleaños
  referralPoints: 25, // Puntos por referir
  enabled: true
};

// Mock para transacciones de puntos
export const mockPointsTransactions: PointsTransaction[] = [
  {
    id: 'pt1',
    customerId: 'customer1',
    customerName: 'Juan Pérez',
    type: 'add',
    points: 150,
    reason: 'Compra en tienda',
    description: 'Venta #V12345',
    date: new Date('2024-09-10'),
    expiryDate: new Date('2025-09-10')
  },
  {
    id: 'pt2',
    customerId: 'customer1',
    customerName: 'Juan Pérez',
    type: 'add',
    points: 100,
    reason: 'Bienvenida',
    date: new Date('2024-08-01'),
    expiryDate: new Date('2025-08-01')
  },
  {
    id: 'pt3',
    customerId: 'customer2',
    customerName: 'María López',
    type: 'add',
    points: 180,
    reason: 'Compra en tienda',
    description: 'Venta #V12346',
    date: new Date('2024-09-15'),
    expiryDate: new Date('2025-09-15')
  },
  {
    id: 'pt4',
    customerId: 'customer3',
    customerName: 'Carlos Ruiz',
    type: 'add',
    points: 50,
    reason: 'Bienvenida',
    date: new Date('2024-09-25'),
    expiryDate: new Date('2025-09-25')
  },
  {
    id: 'pt5',
    customerId: 'customer4',
    customerName: 'Ana Torres',
    type: 'add',
    points: 220,
    reason: 'Compra en tienda',
    description: 'Venta #V12348',
    date: new Date('2024-09-01'),
    expiryDate: new Date('2025-09-01')
  },
  {
    id: 'pt6',
    customerId: 'customer4',
    customerName: 'Ana Torres',
    type: 'add',
    points: 100,
    reason: 'Cumpleaños',
    date: new Date('2024-03-22'),
    expiryDate: new Date('2025-03-22')
  },
  {
    id: 'pt7',
    customerId: 'customer1',
    customerName: 'Juan Pérez',
    type: 'redeem',
    points: 100,
    reason: 'Canje por descuento',
    description: 'Descuento en venta #V12350',
    date: new Date('2024-09-20')
  }
];

// Mock para zonas de delivery
export const mockDeliveryZones: DeliveryZone[] = [
  {
    id: 'zone1',
    name: 'Zona Centro',
    description: 'Centro de la ciudad',
    fee: 5,
    minOrderAmount: 30,
    estimatedTime: '20-30 min',
    isActive: true
  },
  {
    id: 'zone2',
    name: 'Zona Norte',
    description: 'Área norte de la ciudad',
    fee: 8,
    minOrderAmount: 30,
    estimatedTime: '30-45 min',
    isActive: true
  },
  {
    id: 'zone3',
    name: 'Zona Sur',
    description: 'Área sur de la ciudad',
    fee: 10,
    minOrderAmount: 50,
    estimatedTime: '40-60 min',
    isActive: true
  }
];

// Mock para repartidores
export const mockDeliveryPersons: DeliveryPerson[] = [
  {
    id: 'dp1',
    name: 'Carlos Pérez',
    phone: '987654321',
    isAvailable: true,
    currentOrders: 0,
    vehicleType: 'motorcycle',
    rating: 4.8,
    isActive: true
  },
  {
    id: 'dp2',
    name: 'María Gómez',
    phone: '987654322',
    isAvailable: false,
    currentOrders: 2,
    vehicleType: 'bicycle',
    rating: 4.5,
    isActive: true
  }
];

// Mock para pedidos de delivery
export const mockDeliveryOrders: DeliveryOrder[] = [
  {
    id: 'do1',
    saleId: '3',
    clientId: '1',
    clientName: 'Juan Pérez',
    address: 'Av. Principal 123',
    phone: '987654321',
    zoneId: 'zone1',
    deliveryFee: 5,
    status: 'delivered',
    assignedTo: 'dp1',
    estimatedDeliveryTime: new Date('2024-09-28T18:30:00'),
    actualDeliveryTime: new Date('2024-09-28T18:25:00'),
    createdAt: new Date('2024-09-28T18:00:00')
  },
  {
    id: 'do2',
    saleId: '4',
    clientId: '2',
    clientName: 'María López',
    address: 'Calle Secundaria 456',
    phone: '987654322',
    zoneId: 'zone2',
    deliveryFee: 8,
    status: 'in_transit',
    assignedTo: 'dp2',
    estimatedDeliveryTime: new Date('2024-10-01T19:30:00'),
    createdAt: new Date('2024-10-01T19:00:00')
  },
  {
    id: 'do3',
    saleId: '5',
    clientId: '3',
    clientName: 'Carlos Ruiz',
    address: 'Jr. Los Pinos 789',
    phone: '987654323',
    zoneId: 'zone3',
    deliveryFee: 10,
    status: 'pending',
    createdAt: new Date('2024-10-01T19:15:00')
  }
];

// Mock para configuración del sistema
export const mockSystemConfig: SystemConfig = {
  general: {
    id: 'general1',
    businessName: 'Francachela',
    legalName: 'Licores Francachela S.A.C.',
    taxId: '20123456789',
    currency: 'PEN',
    address: 'Av. Principal 123, Lima',
    phone: '01-234-5678',
    email: 'contacto@francachela.com',
    website: 'www.francachela.com',
    logo: '/placeholder.svg',
    receiptHeader: 'FRANCACHELA - TU TIENDA DE LICORES',
    receiptFooter: '¡Gracias por tu compra!'
  },
  payments: {
    id: 'payments1',
    enabledMethods: ['efectivo', 'yape', 'plin', 'transferencia', 'tarjeta'],
    defaultMethod: 'efectivo',
    allowPartialPayments: true,
    requireReceiptForExpenses: true,
    allowNegativeInventory: false
  },
  points: mockPointsConfig,
  notifications: {
    id: 'notif1',
    lowStockThreshold: 10,
    enableEmailNotifications: true,
    enableSmsNotifications: false,
    notifyOnLowStock: true,
    notifyOnSale: false,
    notifyOnExpense: false,
    notifyOnCashDiscrepancy: true,
    recipientEmails: ['admin@francachela.com']
  },
  security: {
    id: 'security1',
    requirePasswordForVoids: true,
    requirePasswordForReturns: true,
    requirePasswordForDiscounts: true,
    sessionTimeoutMinutes: 30,
    auditTrailDays: 90,
    allowMultipleLogins: false,
    allowRemoteAccess: true
  }
};