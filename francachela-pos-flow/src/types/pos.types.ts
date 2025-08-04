export interface Product {
  id: string;
  name: string;
  price: number;
  barcode?: string;
  stock: number;
  category: string;
  image?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Ticket {
  id: string;
  items: CartItem[];
  customer?: string;
  total: number;
  status: 'active' | 'saved' | 'completed' | 'deleted';
  createdAt: Date;
}

export interface PaymentMethod {
  id: string;
  name: string;
  icon: string;
}

export interface Client {
  id: string;
  name: string;
  points?: number;
  phone?: string;
  email?: string;
  address?: string;
  isActive?: boolean;
  createdAt?: Date;
}

export interface Sale {
  id: string;
  items: CartItem[];
  customer?: string;
  total: number;
  paymentMethod: 'efectivo' | 'yape' | 'plin' | 'transferencia' | 'tarjeta';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  pointsEarned?: number;
  discountApplied?: number;
}

export interface Promotion {
  id: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed' | 'buy_x_get_y';
  discountValue: number;
  minQuantity?: number;
  minAmount?: number;
  applicableProducts: string[]; // IDs de productos
  validFrom: Date;
  validTo: Date;
  isActive: boolean;
  maxUses?: number;
  currentUses?: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'vendedor' | 'cajero';
  isActive: boolean;
  createdAt?: Date;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface ApiError {
  message: string;
  code?: string;
  field?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  meta?: PaginationMeta;
}

export interface SearchFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  isActive?: boolean;
}
