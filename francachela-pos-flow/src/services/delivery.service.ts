import { apiClient, extractData, extractDirectData } from './api';
import { mockApi } from './mocks';
import { DeliveryZone, DeliveryPerson, DeliveryOrder } from '@/types/system.types';

export class DeliveryService {
  private static instance: DeliveryService;

  private constructor() {}

  static getInstance(): DeliveryService {
    if (!DeliveryService.instance) {
      DeliveryService.instance = new DeliveryService();
    }
    return DeliveryService.instance;
  }

  // Zonas de Delivery
  async getDeliveryZones() {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getDeliveryZones();
    }

    const response = await apiClient.get<DeliveryZone[]>('/delivery/zones');
    return extractDirectData(response);
  }

  async createDeliveryZone(zone: Omit<DeliveryZone, 'id'>) {
    if (apiClient.shouldUseMocks()) {
      // En mock simplemente simulamos la creación
      return {
        ...zone,
        id: `zone${Date.now()}`
      };
    }

    const response = await apiClient.post<DeliveryZone>('/delivery/zones', zone);
    return extractDirectData(response);
  }

  async updateDeliveryZone(id: string, data: Partial<DeliveryZone>) {
    if (apiClient.shouldUseMocks()) {
      const zones = await mockApi.getDeliveryZones();
      const zone = zones.find(z => z.id === id);
      if (!zone) throw new Error('Zona no encontrada');
      
      return { ...zone, ...data };
    }

    const response = await apiClient.put<DeliveryZone>(`/delivery/zones/${id}`, data);
    return extractDirectData(response);
  }

  // Repartidores
  async getDeliveryPersons(available?: boolean) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getDeliveryPersons(available);
    }

    const response = await apiClient.get<DeliveryPerson[]>('/delivery/persons', {
      params: { available }
    });
    return extractDirectData(response);
  }

  async createDeliveryPerson(person: Omit<DeliveryPerson, 'id'>) {
    if (apiClient.shouldUseMocks()) {
      // En mock simplemente simulamos la creación
      return {
        ...person,
        id: `dp${Date.now()}`
      };
    }

    const response = await apiClient.post<DeliveryPerson>('/delivery/persons', person);
    return extractDirectData(response);
  }

  async updateDeliveryPersonStatus(id: string, isAvailable: boolean) {
    if (apiClient.shouldUseMocks()) {
      const persons = await mockApi.getDeliveryPersons();
      const person = persons.find(p => p.id === id);
      if (!person) throw new Error('Repartidor no encontrado');
      
      return { ...person, isAvailable };
    }

    const response = await apiClient.patch<DeliveryPerson>(`/delivery/persons/${id}/status`, {
      isAvailable
    });
    return extractDirectData(response);
  }

  // Pedidos
  async getDeliveryOrders(status?: DeliveryOrder['status']) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.getDeliveryOrders(status);
    }

    const response = await apiClient.get<DeliveryOrder[]>('/delivery/orders', {
      params: { status }
    });
    return extractDirectData(response);
  }

  async getDeliveryOrder(id: string) {
    if (apiClient.shouldUseMocks()) {
      const orders = await mockApi.getDeliveryOrders();
      return orders.find(o => o.id === id) || null;
    }

    const response = await apiClient.get<DeliveryOrder>(`/delivery/orders/${id}`);
    return extractDirectData(response);
  }

  async createDeliveryOrder(order: Omit<DeliveryOrder, 'id' | 'createdAt'>) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.createDeliveryOrder(order);
    }

    const response = await apiClient.post<DeliveryOrder>('/delivery/orders', order);
    return extractDirectData(response);
  }

  async assignDeliveryOrder(orderId: string, deliveryPersonId: string) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.updateDeliveryOrderStatus(orderId, 'assigned', deliveryPersonId);
    }

    const response = await apiClient.patch<DeliveryOrder>(`/delivery/orders/${orderId}/assign`, {
      deliveryPersonId
    });
    return extractDirectData(response);
  }

  async updateDeliveryOrderStatus(orderId: string, status: DeliveryOrder['status']) {
    if (apiClient.shouldUseMocks()) {
      return mockApi.updateDeliveryOrderStatus(orderId, status);
    }

    const response = await apiClient.patch<DeliveryOrder>(`/delivery/orders/${orderId}/status`, {
      status
    });
    return extractDirectData(response);
  }

  // Informes y estadísticas
  async getDeliveryStats(startDate?: Date, endDate?: Date) {
    if (apiClient.shouldUseMocks()) {
      const orders = await mockApi.getDeliveryOrders();
      const filteredOrders = orders.filter(o => {
        let match = true;
        if (startDate && o.createdAt < startDate) match = false;
        if (endDate && o.createdAt > endDate) match = false;
        return match;
      });

      const totalOrders = filteredOrders.length;
      const completedOrders = filteredOrders.filter(o => o.status === 'delivered').length;
      const pendingOrders = filteredOrders.filter(o => o.status === 'pending').length;
      const inTransitOrders = filteredOrders.filter(o => o.status === 'in_transit').length;
      const cancelledOrders = filteredOrders.filter(o => o.status === 'cancelled').length;

      const totalRevenue = filteredOrders
        .filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + o.deliveryFee, 0);

      const averageDeliveryTime = filteredOrders
        .filter(o => o.status === 'delivered' && o.actualDeliveryTime && o.createdAt)
        .map(o => {
          const actualTime = o.actualDeliveryTime!.getTime();
          const createdTime = o.createdAt.getTime();
          return (actualTime - createdTime) / (1000 * 60); // Tiempo en minutos
        });

      return {
        period: {
          from: startDate || new Date(Math.min(...filteredOrders.map(o => o.createdAt.getTime()))),
          to: endDate || new Date()
        },
        orders: {
          total: totalOrders,
          completed: completedOrders,
          pending: pendingOrders,
          inTransit: inTransitOrders,
          cancelled: cancelledOrders
        },
        revenue: {
          total: totalRevenue,
          average: totalRevenue / (completedOrders || 1)
        },
        time: {
          average: averageDeliveryTime.length
            ? averageDeliveryTime.reduce((sum, t) => sum + t, 0) / averageDeliveryTime.length
            : 0
        },
        byZone: filteredOrders.reduce((acc, order) => {
          if (!acc[order.zoneId]) {
            acc[order.zoneId] = { count: 0, revenue: 0 };
          }
          acc[order.zoneId].count++;
          if (order.status === 'delivered') {
            acc[order.zoneId].revenue += order.deliveryFee;
          }
          return acc;
        }, {} as Record<string, { count: number; revenue: number }>)
      };
    }

    const response = await apiClient.get('/delivery/stats', {
      params: {
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString()
      }
    });
    return extractDirectData(response);
  }
}

export const deliveryService = DeliveryService.getInstance();