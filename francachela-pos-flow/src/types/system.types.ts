// Tipos para el módulo de cajas (control de turnos y cierre de cajas)
export interface CashRegister {
  id: string;
  name: string;
  location?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface CashierShift {
  id: string;
  registerId: string;
  userId: string;
  userName: string;
  startAmount: number;
  endAmount?: number;
  expectedEndAmount?: number;
  discrepancy?: number;
  startTime: Date;
  endTime?: Date;
  status: 'active' | 'closed' | 'pending_approval';
  notes?: string;
  transactions: ShiftTransaction[];
}

export interface ShiftTransaction {
  id: string;
  shiftId: string;
  type: 'sale' | 'expense' | 'return' | 'deposit' | 'withdrawal';
  amount: number;
  paymentMethod: 'efectivo' | 'yape' | 'plin' | 'transferencia' | 'tarjeta';
  description: string;
  reference?: string;
  timestamp: Date;
}

// Tipos para el módulo de gastos
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: Date;
  paymentMethod: string;
  approved: boolean;
  approvedBy?: string;
  receipt?: string; // URL de la imagen o archivo
  tags?: string[];
  recurring?: boolean;
  recurringFrequency?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export interface ExpenseCategory {
  id: string;
  name: string;
  description?: string;
  budget?: number;
  budgetPeriod?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

// Tipos para el módulo de puntos
export interface PointsConfig {
  id: string;
  pointsPerPurchaseAmount: number; // Cantidad de puntos por cada unidad de moneda
  pointsExpirationDays: number; // Días para expiración de puntos
  minimumRedeemPoints: number; // Puntos mínimos para redimir
  pointValueInCurrency: number; // Valor de cada punto en moneda
  welcomePoints: number; // Puntos por registro
  birthdayPoints: number; // Puntos por cumpleaños
  referralPoints: number; // Puntos por referir
  enabled: boolean;
}

export interface PointsTransaction {
  id: string;
  customerId: string;
  customerName: string;
  type: 'add' | 'redeem';
  points: number;
  reason: string;
  description?: string;
  date: Date;
  expiryDate?: Date;
}

export interface Customer {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  points: number;
  lastPointsActivity?: Date;
  memberSince: Date;
  birthdate?: Date;
}

// Tipos para el módulo de delivery
export interface DeliveryZone {
  id: string;
  name: string;
  description?: string;
  fee: number;
  minOrderAmount?: number;
  estimatedTime: string; // "30-45 min"
  isActive: boolean;
}

export interface DeliveryOrder {
  id: string;
  saleId: string;
  clientId: string;
  clientName: string;
  address: string;
  phone: string;
  zoneId: string;
  deliveryFee: number;
  status: 'pending' | 'assigned' | 'in_transit' | 'delivered' | 'cancelled';
  assignedTo?: string;
  estimatedDeliveryTime?: Date;
  actualDeliveryTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface DeliveryPerson {
  id: string;
  name: string;
  phone: string;
  isAvailable: boolean;
  currentOrders: number;
  vehicleType: 'motorcycle' | 'bicycle' | 'car' | 'walking';
  rating?: number;
  isActive: boolean;
}

// Tipos para el módulo de configuración
export interface SystemConfig {
  general: GeneralConfig;
  payments: PaymentConfig;
  points: PointsConfig;
  notifications: NotificationConfig;
  security: SecurityConfig;
}

export interface GeneralConfig {
  id: string;
  businessName: string;
  legalName?: string;
  taxId?: string;
  currency: string;
  address?: string;
  phone?: string;
  email?: string;
  website?: string;
  logo?: string;
  receiptHeader?: string;
  receiptFooter?: string;
}

export interface PaymentConfig {
  id: string;
  enabledMethods: string[]; // ['efectivo', 'yape', 'plin', 'transferencia', 'tarjeta']
  defaultMethod: string;
  allowPartialPayments: boolean;
  requireReceiptForExpenses: boolean;
  allowNegativeInventory: boolean;
}

export interface NotificationConfig {
  id: string;
  lowStockThreshold: number;
  enableEmailNotifications: boolean;
  enableSmsNotifications: boolean;
  notifyOnLowStock: boolean;
  notifyOnSale: boolean;
  notifyOnExpense: boolean;
  notifyOnCashDiscrepancy: boolean;
  recipientEmails?: string[];
  recipientPhones?: string[];
}

export interface SecurityConfig {
  id: string;
  requirePasswordForVoids: boolean;
  requirePasswordForReturns: boolean;
  requirePasswordForDiscounts: boolean;
  sessionTimeoutMinutes: number;
  auditTrailDays: number;
  allowMultipleLogins: boolean;
  allowRemoteAccess: boolean;
}

// Tipos para auditoría y registros
export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details?: string;
  timestamp: Date;
  ipAddress?: string;
}