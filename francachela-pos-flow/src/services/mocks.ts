import { Product, Client, Sale, Promotion, User, LoginCredentials, AuthResponse } from '@/types/pos.types';

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
  }
}; 