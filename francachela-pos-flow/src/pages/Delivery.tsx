import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { deliveryService } from "@/services";
import { DeliveryOrder, DeliveryZone, DeliveryPerson } from "@/types/system.types";
import {
  Truck,
  MapPin,
  Package,
  Search,
  Plus,
  Filter,
  ArrowUpDown,
  Phone,
  Clock,
  UserCheck,
  MoreVertical,
  CalendarClock,
  CheckCircle2,
  XCircle,
  Download,
  History
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showSuccess, showError, showWarning } from "@/lib/toast";

const DeliveryPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<DeliveryOrder[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [deliveryPersons, setDeliveryPersons] = useState<DeliveryPerson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("pending");
  
  // Estado para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [zoneFilter, setZoneFilter] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  // Estado para diálogos
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<DeliveryOrder | null>(null);
  const [selectedDeliveryPerson, setSelectedDeliveryPerson] = useState<string>("");
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Cargar zonas de delivery
        const zonesData = await deliveryService.getDeliveryZones();
        setZones(zonesData);
        
        // Cargar repartidores
        const deliveryPersonsData = await deliveryService.getDeliveryPersons();
        setDeliveryPersons(deliveryPersonsData);
        
        // Cargar pedidos
        await loadOrders();
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        showError("Error al cargar los datos de delivery");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Filtrar pedidos por estado
  useEffect(() => {
    loadOrders();
  }, [activeTab]);
  
  const loadOrders = async () => {
    setIsLoading(true);
    try {
      let status: DeliveryOrder['status'] | undefined = undefined;
      
      switch (activeTab) {
        case "pending":
          status = "pending";
          break;
        case "assigned":
          status = "assigned";
          break;
        case "inTransit":
          status = "in_transit";
          break;
        case "delivered":
          status = "delivered";
          break;
        case "cancelled":
          status = "cancelled";
          break;
        // En "all", no aplicamos filtro de estado
      }
      
      const ordersData = await deliveryService.getDeliveryOrders(status);
      setOrders(ordersData);
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
      showError("Error al cargar la lista de pedidos");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Asignar pedido
  const handleAssignOrder = async () => {
    if (!selectedOrder || !selectedDeliveryPerson) {
      showWarning("Selecciona un repartidor para asignar el pedido");
      return;
    }
    
    setIsLoading(true);
    try {
      const updatedOrder = await deliveryService.assignDeliveryOrder(
        selectedOrder.id,
        selectedDeliveryPerson
      );
      
      // Actualizar lista de pedidos
      setOrders(prev => prev.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));
      
      setShowAssignDialog(false);
      showSuccess("Pedido asignado correctamente");
      setSelectedDeliveryPerson("");
    } catch (error) {
      console.error("Error al asignar pedido:", error);
      showError("Error al asignar el pedido");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Actualizar estado del pedido
  const updateOrderStatus = async (orderId: string, status: DeliveryOrder['status']) => {
    setIsLoading(true);
    try {
      const updatedOrder = await deliveryService.updateDeliveryOrderStatus(
        orderId,
        status
      );
      
      // Actualizar lista de pedidos
      setOrders(prev => prev.map(order => 
        order.id === updatedOrder.id ? updatedOrder : order
      ));
      
      showSuccess(`Estado del pedido actualizado a: ${getStatusText(status)}`);
    } catch (error) {
      console.error("Error al actualizar estado del pedido:", error);
      showError("Error al actualizar el estado del pedido");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Ver detalles de pedido
  const viewOrderDetails = (order: DeliveryOrder) => {
    setSelectedOrder(order);
    setShowOrderDetailsDialog(true);
  };
  
  // Filtrar y ordenar pedidos
  const filteredOrders = orders
    .filter(order => {
      if (!searchTerm && !zoneFilter) return true;
      
      let matches = true;
      
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
          order.clientName.toLowerCase().includes(searchLower) ||
          order.address.toLowerCase().includes(searchLower) ||
          order.phone.includes(searchTerm);
          
        if (!matchesSearch) matches = false;
      }
      
      if (zoneFilter && order.zoneId !== zoneFilter) {
        matches = false;
      }
      
      return matches;
    })
    .sort((a, b) => {
      // Ordenar por fecha de creación
      if (sortOrder === "asc") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  
  // Formatear fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };
  
  // Formatear hora
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('es-PE', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };
  
  // Obtener texto de estado
  const getStatusText = (status: DeliveryOrder['status']) => {
    switch (status) {
      case "pending": return "Pendiente";
      case "assigned": return "Asignado";
      case "in_transit": return "En camino";
      case "delivered": return "Entregado";
      case "cancelled": return "Cancelado";
      default: return "Desconocido";
    }
  };
  
  // Obtener color de estado
  const getStatusColor = (status: DeliveryOrder['status']) => {
    switch (status) {
      case "pending": return "bg-yellow-500";
      case "assigned": return "bg-blue-500";
      case "in_transit": return "bg-purple-500";
      case "delivered": return "bg-green-500";
      case "cancelled": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };
  
  // Obtener nombre de zona
  const getZoneName = (zoneId: string) => {
    const zone = zones.find(z => z.id === zoneId);
    return zone ? zone.name : "Desconocida";
  };
  
  // Obtener nombre de repartidor
  const getDeliveryPersonName = (personId: string) => {
    const person = deliveryPersons.find(p => p.id === personId);
    return person ? person.name : "No asignado";
  };
  
  // Calcular estadísticas
  const getStats = () => {
    const stats = {
      pending: orders.filter(o => o.status === "pending").length,
      assigned: orders.filter(o => o.status === "assigned").length,
      inTransit: orders.filter(o => o.status === "in_transit").length,
      delivered: orders.filter(o => o.status === "delivered").length,
      cancelled: orders.filter(o => o.status === "cancelled").length,
      total: orders.length,
      avgDeliveryTime: 0
    };
    
    // Calcular tiempo promedio de entrega (solo pedidos entregados)
    const deliveredOrders = orders.filter(o => o.status === "delivered" && o.actualDeliveryTime);
    if (deliveredOrders.length > 0) {
      const totalTime = deliveredOrders.reduce((sum, order) => {
        const deliveryTime = order.actualDeliveryTime ? 
          new Date(order.actualDeliveryTime).getTime() - new Date(order.createdAt).getTime() : 0;
        return sum + deliveryTime;
      }, 0);
      
      stats.avgDeliveryTime = Math.round(totalTime / deliveredOrders.length / 60000); // Convertir a minutos
    }
    
    return stats;
  };
  
  const stats = getStats();
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Delivery</h1>
        <Button onClick={() => {}}>
          <Plus className="mr-2 h-4 w-4" /> Nuevo Pedido
        </Button>
      </div>
      
      {/* Dashboard de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Package className="mr-2 h-5 w-5" /> Pendientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <UserCheck className="mr-2 h-5 w-5" /> Asignados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.assigned}</div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Truck className="mr-2 h-5 w-5" /> En Camino
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{stats.inTransit}</div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CheckCircle2 className="mr-2 h-5 w-5" /> Entregados
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.delivered}</div>
          </CardContent>
        </Card>
        
        <Card className="col-span-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Clock className="mr-2 h-5 w-5" /> Tiempo Prom.
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {stats.avgDeliveryTime > 0 ? `${stats.avgDeliveryTime} min` : "-"}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Filtros y listado */}
      <Card>
        <CardHeader className="pb-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="pending">Pendientes</TabsTrigger>
                <TabsTrigger value="assigned">Asignados</TabsTrigger>
                <TabsTrigger value="inTransit">En Camino</TabsTrigger>
                <TabsTrigger value="delivered">Entregados</TabsTrigger>
                <TabsTrigger value="cancelled">Cancelados</TabsTrigger>
                <TabsTrigger value="all">Todos</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </div>
            
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="searchTerm" className="mb-1 block">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="searchTerm"
                    placeholder="Buscar por cliente, dirección..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-48">
                <Label htmlFor="zoneFilter" className="mb-1 block">Zona</Label>
                <select
                  id="zoneFilter"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={zoneFilter}
                  onChange={(e) => setZoneFilter(e.target.value)}
                >
                  <option value="">Todas las zonas</option>
                  {zones.map((zone) => (
                    <option key={zone.id} value={zone.id}>{zone.name}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                >
                  <ArrowUpDown className="h-4 w-4 mr-1" />
                  {sortOrder === "asc" ? "Más antiguos primero" : "Más recientes primero"}
                </Button>
              </div>
            </div>
          </Tabs>
        </CardHeader>
        
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No hay pedidos</h3>
              <p className="text-muted-foreground mb-4">
                No se encontraron pedidos {activeTab !== "all" ? `en estado "${getStatusText(activeTab as DeliveryOrder['status'])}"` : ""}
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-2">ID / Fecha</div>
                <div className="col-span-2">Cliente</div>
                <div className="col-span-3">Dirección</div>
                <div className="col-span-1">Zona</div>
                <div className="col-span-2">Repartidor</div>
                <div className="col-span-1">Estado</div>
                <div className="col-span-1 text-right">Acciones</div>
              </div>
              <div className="divide-y">
                {filteredOrders.map((order) => (
                  <div key={order.id} className="grid grid-cols-12 items-center p-3 hover:bg-muted/30 transition-colors">
                    <div className="col-span-2">
                      <div className="font-medium">#{order.id.slice(-6)}</div>
                      <div className="text-xs text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="font-medium">{order.clientName}</div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Phone className="h-3 w-3 mr-1" /> {order.phone}
                      </div>
                    </div>
                    <div className="col-span-3">
                      <div className="flex items-start">
                        <MapPin className="h-4 w-4 mr-1 mt-0.5 text-muted-foreground flex-shrink-0" />
                        <div className="text-sm">{order.address}</div>
                      </div>
                    </div>
                    <div className="col-span-1">
                      <div className="text-sm">{getZoneName(order.zoneId)}</div>
                      <div className="text-xs text-muted-foreground">
                        S/ {order.deliveryFee.toFixed(2)}
                      </div>
                    </div>
                    <div className="col-span-2">
                      {order.assignedTo ? (
                        <div>
                          <div className="text-sm">{getDeliveryPersonName(order.assignedTo)}</div>
                          {order.estimatedDeliveryTime && (
                            <div className="flex items-center text-xs text-muted-foreground">
                              <Clock className="h-3 w-3 mr-1" />
                              Est: {formatTime(order.estimatedDeliveryTime)}
                            </div>
                          )}
                        </div>
                      ) : (
                        <Badge variant="outline" className="bg-muted/50">
                          No asignado
                        </Badge>
                      )}
                    </div>
                    <div className="col-span-1">
                      <Badge className={getStatusColor(order.status)}>
                        {getStatusText(order.status)}
                      </Badge>
                    </div>
                    <div className="col-span-1 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => viewOrderDetails(order)}>
                            Ver detalles
                          </DropdownMenuItem>
                          
                          {order.status === "pending" && (
                            <DropdownMenuItem onClick={() => {
                              setSelectedOrder(order);
                              setShowAssignDialog(true);
                            }}>
                              Asignar repartidor
                            </DropdownMenuItem>
                          )}
                          
                          {order.status === "assigned" && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "in_transit")}>
                              Marcar en camino
                            </DropdownMenuItem>
                          )}
                          
                          {order.status === "in_transit" && (
                            <DropdownMenuItem onClick={() => updateOrderStatus(order.id, "delivered")}>
                              Marcar entregado
                            </DropdownMenuItem>
                          )}
                          
                          {(order.status === "pending" || order.status === "assigned") && (
                            <DropdownMenuItem 
                              className="text-destructive focus:text-destructive"
                              onClick={() => updateOrderStatus(order.id, "cancelled")}
                            >
                              Cancelar pedido
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Diálogo para asignar repartidor */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Asignar Repartidor</DialogTitle>
            <DialogDescription>
              Selecciona un repartidor para asignar este pedido
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4 py-2">
              <div className="bg-muted p-3 rounded-md">
                <div className="font-medium">Pedido #{selectedOrder.id.slice(-6)}</div>
                <div className="text-sm">{selectedOrder.clientName}</div>
                <div className="text-sm text-muted-foreground flex items-center mt-1">
                  <MapPin className="h-3.5 w-3.5 mr-1" />
                  {selectedOrder.address}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliveryPerson">Repartidor</Label>
                <select
                  id="deliveryPerson"
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                  value={selectedDeliveryPerson}
                  onChange={(e) => setSelectedDeliveryPerson(e.target.value)}
                  disabled={isLoading}
                >
                  <option value="">Selecciona un repartidor...</option>
                  {deliveryPersons
                    .filter(dp => dp.isAvailable && dp.isActive)
                    .map((person) => (
                      <option key={person.id} value={person.id}>
                        {person.name} - {person.vehicleType === 'motorcycle' ? '🏍️' : 
                                         person.vehicleType === 'bicycle' ? '🚲' : 
                                         person.vehicleType === 'car' ? '🚗' : '👣'}
                      </option>
                    ))
                  }
                </select>
                <div className="text-xs text-muted-foreground mt-1">
                  Nota: Solo se muestran repartidores disponibles
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Tiempo estimado de entrega</Label>
                <div className="flex space-x-2 items-center">
                  <CalendarClock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {zones.find(z => z.id === selectedOrder.zoneId)?.estimatedTime || "30-45 min"}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Basado en la zona de entrega seleccionada
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowAssignDialog(false)} 
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button onClick={handleAssignOrder} disabled={isLoading || !selectedDeliveryPerson}>
              {isLoading ? "Procesando..." : "Asignar Pedido"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para ver detalles de pedido */}
      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalles del Pedido</DialogTitle>
            <DialogDescription>
              #{selectedOrder?.id.slice(-6)}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center">
                <div>
                  <Badge className={getStatusColor(selectedOrder.status)}>
                    {getStatusText(selectedOrder.status)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatDate(selectedOrder.createdAt)}
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Cliente</div>
                  <div className="font-medium">{selectedOrder.clientName}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Teléfono</div>
                  <div className="font-medium">{selectedOrder.phone}</div>
                </div>
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Dirección</div>
                  <div className="font-medium">{selectedOrder.address}</div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Zona</div>
                    <div className="font-medium">{getZoneName(selectedOrder.zoneId)}</div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Costo de delivery</div>
                    <div className="font-medium">S/ {selectedOrder.deliveryFee.toFixed(2)}</div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Repartidor</div>
                  <div className="font-medium">
                    {selectedOrder.assignedTo ? 
                      getDeliveryPersonName(selectedOrder.assignedTo) : 
                      "No asignado"}
                  </div>
                </div>
                
                {selectedOrder.estimatedDeliveryTime && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Entrega estimada</div>
                    <div className="font-medium">{formatDate(selectedOrder.estimatedDeliveryTime)}</div>
                  </div>
                )}
                
                {selectedOrder.actualDeliveryTime && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Entregado el</div>
                    <div className="font-medium">{formatDate(selectedOrder.actualDeliveryTime)}</div>
                  </div>
                )}
                
                {selectedOrder.notes && (
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Notas</div>
                    <div className="text-sm p-2 bg-muted rounded-md">{selectedOrder.notes}</div>
                  </div>
                )}
              </div>
              
              <div className="pt-4 flex justify-between">
                <Button 
                  variant="outline"
                  className="flex gap-2 items-center"
                  onClick={() => window.open(`tel:${selectedOrder.phone}`)}
                >
                  <Phone className="h-4 w-4" /> Llamar
                </Button>
                
                {selectedOrder.status === "pending" && (
                  <Button 
                    onClick={() => {
                      setShowOrderDetailsDialog(false);
                      setShowAssignDialog(true);
                    }}
                  >
                    Asignar repartidor
                  </Button>
                )}
                
                {selectedOrder.status === "assigned" && (
                  <Button 
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "in_transit");
                      setShowOrderDetailsDialog(false);
                    }}
                  >
                    Marcar en camino
                  </Button>
                )}
                
                {selectedOrder.status === "in_transit" && (
                  <Button 
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "delivered");
                      setShowOrderDetailsDialog(false);
                    }}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" /> Marcar entregado
                  </Button>
                )}
                
                {(selectedOrder.status === "pending" || selectedOrder.status === "assigned") && (
                  <Button 
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      updateOrderStatus(selectedOrder.id, "cancelled");
                      setShowOrderDetailsDialog(false);
                    }}
                  >
                    <XCircle className="mr-2 h-4 w-4" /> Cancelar pedido
                  </Button>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeliveryPage;