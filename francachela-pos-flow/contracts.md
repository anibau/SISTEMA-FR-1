1. Create/Update Ticket Contract
interface TicketRequest {
  id?: string;  // Required for updates, not for creation
  customer?: string; // Customer ID or null
  items: Array<{
    id: string;
    quantity: number;
    price: number;
  }>;
  observations?: string; // For ticket notes
  status?: 'active' | 'saved' | 'completed' | 'deleted';
}

2. Complete Sale Contract
interface CompleteSaleRequest {
  ticketId: string;
  paymentMethod: 'efectivo' | 'tarjeta' | 'yape' | 'plin';
  amountReceived?: number; // For cash payments
  change?: number; // For cash payments
}

interface CompleteSaleResponse {
  id: string;
  receiptNumber: string;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    subtotal: number;
  }>;
  customer?: {
    id: string;
    name: string;
  };
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: string;
  amountReceived?: number;
  change?: number;
  createdAt: Date;
  observations?: string;
}



3. Products Response Contract
interface ProductsResponse {
  data: Array<{
    id: string;
    name: string;
    price: number;
    cost?: number;
    barcode?: string;
    sku?: string;
    stock: number;
    minStock?: number;
    category: string;
    brand?: string;
    supplier?: string;
    description?: string;
    image?: string;
    isActive: boolean;
    isFeatured: boolean;
  }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}