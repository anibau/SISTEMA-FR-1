import { create } from 'zustand';
import { Product, CartItem, Ticket, Client } from '@/types/pos.types';
import { productsService, customersService } from '@/services';
import { showError, showSuccess, showWarning } from '@/lib/toast';

interface POSState {
  tickets: Ticket[];
  activeTicketId: string;
  products: Product[];
  selectedCategory: string;
  clients: Client[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setActiveTicketId: (id: string) => void;
  createNewTicket: () => void;
  addToCart: (product: Product) => void;
  updateQuantity: (productId: string, newQuantity: number) => void;
  removeFromCart: (productId: string) => void;
  deleteTicket: (ticketId: string) => void;
  restoreTicket: (ticketId: string) => void;
  setClientToTicket: (ticketId: string, client: Client) => void;
  updateTicketObservations: (ticketId: string, observations: string) => void;
  processSale: (ticketId: string, paymentMethod: string) => void;
  filterProducts: (searchTerm: string, category: string) => Product[];
  setSelectedCategory: (category: string) => void;
  
  // API Actions
  loadProducts: () => Promise<void>;
  loadClients: () => Promise<void>;
  searchProductByBarcode: (barcode: string) => Promise<Product | null>;
  searchClients: (query: string) => Promise<Client[]>;
}

export const usePOSStore = create<POSState>((set, get) => ({
  tickets: [],
  activeTicketId: "",
  products: [],
  selectedCategory: "Todos",
  clients: [],
  isLoading: false,
  error: null,

  setSelectedCategory: (category) => set({ selectedCategory: category }),
  
  setActiveTicketId: (id) => set({ activeTicketId: id }),

  createNewTicket: () => {
    const newTicket: Ticket = {
      id: `T${Date.now()}`,
      items: [],
      total: 0,
      status: 'active',
      createdAt: new Date(),
      observations: ""
    };
    set((state): Partial<POSState> => ({
      tickets: [...state.tickets, newTicket],
      activeTicketId: newTicket.id
    }));
  },

  addToCart: (product) => {
    const state = get();
    const activeTicket = state.tickets.find(t => t.id === state.activeTicketId);
    if (!activeTicket) return;

    const existingItem = activeTicket.items.find(item => item.id === product.id);
    let updatedItems: CartItem[];

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        showWarning(`Stock insuficiente. Solo quedan ${product.stock} unidades.`);
        return;
      }
      updatedItems = activeTicket.items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      if (product.stock === 0) {
        showError("Producto agotado");
        return;
      }
      updatedItems = [...activeTicket.items, { ...product, quantity: 1 }];
    }

    const newTotal = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    set(state => ({
      tickets: state.tickets.map(ticket =>
        ticket.id === state.activeTicketId
          ? { ...ticket, items: updatedItems, total: newTotal }
          : ticket
      )
    }));
  },

  updateQuantity: (productId, newQuantity) => {
    const state = get();
    const activeTicket = state.tickets.find(t => t.id === state.activeTicketId);
    if (!activeTicket) return;

    if (newQuantity === 0) {
      get().removeFromCart(productId);
      return;
    }

    const product = state.products.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      showWarning(`Stock insuficiente. Solo quedan ${product.stock} unidades.`);
      return;
    }

    const updatedItems = activeTicket.items.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );

    const newTotal = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    set(state => ({
      tickets: state.tickets.map(ticket =>
        ticket.id === state.activeTicketId
          ? { ...ticket, items: updatedItems, total: newTotal }
          : ticket
      )
    }));
  },

  removeFromCart: (productId) => {
    const state = get();
    const activeTicket = state.tickets.find(t => t.id === state.activeTicketId);
    if (!activeTicket) return;

    const updatedItems = activeTicket.items.filter(item => item.id !== productId);
    const newTotal = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);

    set(state => ({
      tickets: state.tickets.map(ticket =>
        ticket.id === state.activeTicketId
          ? { ...ticket, items: updatedItems, total: newTotal }
          : ticket
      )
    }));
  },

  deleteTicket: (ticketId) => {
    set(state => {
      const updatedTickets = state.tickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: 'deleted' as Ticket['status'] }
          : ticket
      );

      if (ticketId === state.activeTicketId) {
        const activeTickets = updatedTickets.filter(t => t.status !== 'deleted');
        if (activeTickets.length > 0) {
          return { tickets: updatedTickets, activeTicketId: activeTickets[0].id };
        } else {
          get().createNewTicket();
          return { tickets: updatedTickets };
        }
      }

      return { tickets: updatedTickets };
    });
  },

  restoreTicket: (ticketId) => {
    set(state => ({
      tickets: state.tickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, status: 'active' }
          : ticket
      )
    }));
  },

  setClientToTicket: (ticketId, client) => {
    set(state => ({
      tickets: state.tickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, customer: client.name }
          : ticket
      )
    }));
  },

  processSale: async (ticketId, paymentMethod) => {
    const state = get();
    const ticket = state.tickets.find(t => t.id === ticketId);
    if (!ticket || ticket.items.length === 0) {
      showWarning("No hay productos en el carrito");
      return;
    }

    try {
      // Aquí se integraría con el servicio de ventas
      // const sale = await salesService.createSale({
      //   items: ticket.items,
      //   customer: ticket.customer,
      //   total: ticket.total,
      //   paymentMethod: paymentMethod as any,
      //   status: 'completed'
      // });

      // No mostrar notificación de éxito
      
      // Marcar el ticket como completado
      set(state => ({
        tickets: state.tickets.map(t =>
          t.id === ticketId
            ? { ...t, status: 'completed' }
            : t
        )
      }));
      
      // Limpiar el ticket actual sin crear uno nuevo
      const clearedTicket: Ticket = {
        id: ticketId,
        items: [],
        total: 0,
        status: 'active',
        createdAt: new Date(),
        observations: ""
      };
      
      set(state => ({
        tickets: state.tickets.map(t => 
          t.id === ticketId
            ? clearedTicket
            : t
        )
      }));
      
      // No crear un nuevo ticket automáticamente
    } catch (error) {
      console.error('Error processing sale:', error);
      showError('Error al procesar la venta');
    }
  },

  filterProducts: (searchTerm, category) => {
    const state = get();
    let filtered = state.products;
    
    if (category !== "Todos") {
      filtered = filtered.filter(p => p.category === category);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode?.includes(searchTerm)
      );
    }
    
    return filtered;
  },

  // API Actions
  loadProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await productsService.getProducts();
      set({ products: result.data, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Error al cargar productos', 
        isLoading: false 
      });
      console.error('Error loading products:', error);
    }
  },

  loadClients: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await customersService.getCustomers();
      set({ clients: result.data, isLoading: false });
    } catch (error) {
      set({ 
        error: 'Error al cargar clientes', 
        isLoading: false 
      });
      console.error('Error loading clients:', error);
    }
  },

  searchProductByBarcode: async (barcode: string) => {
    try {
      const product = await productsService.getProductByBarcode(barcode);
      return product;
    } catch (error) {
      console.error('Error searching product by barcode:', error);
      return null;
    }
  },

  searchClients: async (query: string) => {
    try {
      const clients = await customersService.searchCustomers(query);
      return clients;
    } catch (error) {
      console.error('Error searching clients:', error);
      return [];
    }
  },

  updateTicketObservations: (ticketId, observations) => {
    set(state => ({
      tickets: state.tickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, observations }
          : ticket
      )
    }));
  },
}));
