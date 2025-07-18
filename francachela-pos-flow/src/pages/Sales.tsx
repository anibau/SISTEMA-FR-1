
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell
} from 'recharts';
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  DollarSign,
  ShoppingCart,
  Calendar,
  Users,
  Eye,
  Printer,
  RefreshCw
} from "lucide-react";

interface Sale {
  id: string;
  ticketNumber: string;
  date: Date;
  customer?: string;
  customerType: 'registered' | 'anonymous';
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  igv: number;
  total: number;
  paymentMethod: 'cash' | 'yape' | 'plin' | 'card' | 'transfer';
  cashier: string;
  status: 'completed' | 'cancelled' | 'refunded';
  pointsEarned?: number;
}

const sampleSales: Sale[] = [
  {
    id: "1",
    ticketNumber: "T001234",
    date: new Date("2024-01-15T18:30:00"),
    customer: "Carlos Mendoza",
    customerType: 'registered',
    items: [
      { name: "Cerveza Pilsen 650ml", quantity: 6, price: 4.50, total: 27.00 },
      { name: "Pisco Queirolo 750ml", quantity: 1, price: 28.90, total: 28.90 }
    ],
    subtotal: 55.90,
    igv: 10.06,
    total: 65.96,
    paymentMethod: 'yape',
    cashier: "Juan Pérez",
    status: 'completed',
    pointsEarned: 13
  },
  {
    id: "2",
    ticketNumber: "T001235",
    date: new Date("2024-01-15T17:45:00"),
    customerType: 'anonymous',
    items: [
      { name: "Vodka Absolut 750ml", quantity: 1, price: 65.00, total: 65.00 }
    ],
    subtotal: 65.00,
    igv: 11.70,
    total: 76.70,
    paymentMethod: 'cash',
    cashier: "Juan Pérez",
    status: 'completed'
  },
  {
    id: "3",
    ticketNumber: "T001236",
    date: new Date("2024-01-15T16:20:00"),
    customer: "Ana García",
    customerType: 'registered',
    items: [
      { name: "Ron Cartavio 750ml", quantity: 1, price: 45.50, total: 45.50 },
      { name: "Cerveza Corona 355ml", quantity: 12, price: 6.50, total: 78.00 }
    ],
    subtotal: 123.50,
    igv: 22.23,
    total: 145.73,
    paymentMethod: 'card',
    cashier: "María López",
    status: 'completed',
    pointsEarned: 29
  },
  {
    id: "4",
    ticketNumber: "T001237",
    date: new Date("2024-01-15T15:10:00"),
    customer: "Luis Rodríguez",
    customerType: 'registered',
    items: [
      { name: "Whisky J.Walker Red", quantity: 1, price: 89.90, total: 89.90 }
    ],
    subtotal: 89.90,
    igv: 16.18,
    total: 106.08,
    paymentMethod: 'plin',
    cashier: "Juan Pérez",
    status: 'completed',
    pointsEarned: 21
  }
];

// Datos para gráficos
const salesByHour = [
  { hour: '9:00', sales: 2 },
  { hour: '10:00', sales: 4 },
  { hour: '11:00', sales: 6 },
  { hour: '12:00', sales: 8 },
  { hour: '13:00', sales: 12 },
  { hour: '14:00', sales: 10 },
  { hour: '15:00', sales: 15 },
  { hour: '16:00', sales: 18 },
  { hour: '17:00', sales: 22 },
  { hour: '18:00', sales: 20 },
  { hour: '19:00', sales: 16 },
  { hour: '20:00', sales: 8 }
];

const paymentMethodData = [
  { name: 'Efectivo', value: 35, color: '#293155' },
  { name: 'Yape', value: 30, color: '#322B42' },
  { name: 'Tarjeta', value: 20, color: '#BBBAC5' },
  { name: 'Plin', value: 15, color: '#1F1D2E' }
];

const Sales = () => {
  const [sales, setSales] = useState<Sale[]>(sampleSales);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const paymentMethods = ["Todos", "cash", "yape", "plin", "card", "transfer"];
  const statusOptions = ["Todos", "completed", "cancelled", "refunded"];

  // Filtrar ventas
  const filteredSales = sales.filter(sale => {
    const matchesSearch = sale.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.customer?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sale.cashier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPayment = selectedPaymentMethod === "Todos" || sale.paymentMethod === selectedPaymentMethod;
    const matchesStatus = selectedStatus === "Todos" || sale.status === selectedStatus;
    
    return matchesSearch && matchesPayment && matchesStatus;
  });

  // Estadísticas
  const totalSales = sales.reduce((sum, sale) => sum + sale.total, 0);
  const totalTransactions = sales.length;
  const averageTicket = totalSales / totalTransactions;
  const todaysSales = sales.filter(sale => {
    const today = new Date();
    return sale.date.toDateString() === today.toDateString();
  });

  const getPaymentMethodIcon = (method: string) => {
    switch (method) {
      case 'cash': return '💵';
      case 'yape': return '📱';
      case 'plin': return '📲';
      case 'card': return '💳';
      case 'transfer': return '🏧';
      default: return '💰';
    }
  };

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cash': return 'Efectivo';
      case 'yape': return 'Yape';
      case 'plin': return 'Plin';
      case 'card': return 'Tarjeta';
      case 'transfer': return 'Transferencia';
      default: return method;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return { variant: 'default', text: 'Completada', color: 'bg-green-500' };
      case 'cancelled':
        return { variant: 'destructive', text: 'Cancelada', color: 'bg-red-500' };
      case 'refunded':
        return { variant: 'secondary', text: 'Reembolsada', color: 'bg-yellow-500' };
      default:
        return { variant: 'outline', text: status, color: 'bg-gray-500' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Ventas</h1>
          <p className="text-muted-foreground">
            Historial completo de transacciones y reportes de ventas
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" className="touch-target">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" className="touch-target">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Estadísticas de ventas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas del Día</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              S/. {todaysSales.reduce((sum, sale) => sum + sale.total, 0).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {todaysSales.length} transacciones
            </p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalTransactions}</div>
            <p className="text-xs text-muted-foreground">registradas</p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">S/. {averageTicket.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">por transacción</p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Atendidos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              {new Set(sales.filter(s => s.customer).map(s => s.customer)).size}
            </div>
            <p className="text-xs text-muted-foreground">clientes únicos</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros y búsqueda */}
      <Card className="pos-card">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar por ticket, cliente o cajero..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pos-button !p-3"
              />
            </div>
            <Button variant="outline" className="touch-target">
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avanzados
            </Button>
          </div>
          
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="flex gap-2 overflow-x-auto">
              <span className="text-sm font-medium py-2 whitespace-nowrap">Método de pago:</span>
              {paymentMethods.map((method) => (
                <Button
                  key={method}
                  variant={selectedPaymentMethod === method ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedPaymentMethod(method)}
                  className="whitespace-nowrap touch-target"
                >
                  {method === "Todos" ? method : getPaymentMethodLabel(method)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
          <TabsTrigger value="reports">Reportes</TabsTrigger>
          <TabsTrigger value="products">Productos</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-4">
          <Card className="pos-card">
            <CardHeader>
              <CardTitle>Historial de Ventas ({filteredSales.length})</CardTitle>
              <CardDescription>Lista detallada de todas las transacciones</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredSales.map((sale) => {
                    const statusBadge = getStatusBadge(sale.status);
                    
                    return (
                      <div
                        key={sale.id}
                        className="border rounded-xl p-4 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                          {/* Información de la venta */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-lg">{sale.ticketNumber}</h3>
                                  <Badge variant={statusBadge.variant as any}>
                                    {statusBadge.text}
                                  </Badge>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  {sale.date.toLocaleString()} • Cajero: {sale.cashier}
                                </p>
                                {sale.customer && (
                                  <p className="text-sm text-primary font-medium">
                                    Cliente: {sale.customer}
                                    {sale.pointsEarned && (
                                      <span className="text-green-600 ml-2">
                                        (+{sale.pointsEarned} puntos)
                                      </span>
                                    )}
                                  </p>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="text-2xl font-bold text-primary">
                                  S/. {sale.total.toFixed(2)}
                                </div>
                                <div className="text-sm text-muted-foreground flex items-center">
                                  {getPaymentMethodIcon(sale.paymentMethod)}
                                  <span className="ml-1">{getPaymentMethodLabel(sale.paymentMethod)}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Items de la venta */}
                            <div className="bg-muted rounded-lg p-3">
                              <div className="space-y-1">
                                {sale.items.map((item, index) => (
                                  <div key={index} className="flex justify-between text-sm">
                                    <span>{item.quantity}x {item.name}</span>
                                    <span>S/. {item.total.toFixed(2)}</span>
                                  </div>
                                ))}
                              </div>
                              <div className="border-t mt-2 pt-2 space-y-1 text-xs text-muted-foreground">
                                <div className="flex justify-between">
                                  <span>Subtotal:</span>
                                  <span>S/. {sale.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>IGV (18%):</span>
                                  <span>S/. {sale.igv.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="touch-target">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="touch-target">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredSales.length === 0 && (
                    <div className="text-center py-12">
                      <ShoppingCart className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No se encontraron ventas</h3>
                      <p className="text-muted-foreground">
                        Intenta con otros términos de búsqueda o ajusta los filtros
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Ventas por hora */}
            <Card className="pos-card">
              <CardHeader>
                <CardTitle>Ventas por Hora</CardTitle>
                <CardDescription>Distribución de ventas durante el día</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={salesByHour}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="sales" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Métodos de pago */}
            <Card className="pos-card">
              <CardHeader>
                <CardTitle>Métodos de Pago</CardTitle>
                <CardDescription>Distribución por tipo de pago</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={paymentMethodData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={(entry) => `${entry.name}: ${entry.value}%`}
                    >
                      {paymentMethodData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de cajeros */}
          <Card className="pos-card">
            <CardHeader>
              <CardTitle>Rendimiento por Cajero</CardTitle>
              <CardDescription>Ventas y transacciones por empleado</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Juan Pérez', 'María López', 'Carlos Silva'].map((cashier) => {
                  const cashierSales = sales.filter(s => s.cashier === cashier);
                  const totalSales = cashierSales.reduce((sum, sale) => sum + sale.total, 0);
                  const transactions = cashierSales.length;
                  
                  return (
                    <div key={cashier} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h3 className="font-semibold">{cashier}</h3>
                        <p className="text-sm text-muted-foreground">
                          {transactions} transacciones
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-primary">
                          S/. {totalSales.toFixed(2)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Promedio: S/. {(totalSales / transactions || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="pos-card">
              <CardHeader>
                <CardTitle>Reporte Diario</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full pos-button">
                  <Download className="h-4 w-4 mr-2" />
                  Generar PDF
                </Button>
              </CardContent>
            </Card>

            <Card className="pos-card">
              <CardHeader>
                <CardTitle>Reporte Mensual</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full pos-button">
                  <Download className="h-4 w-4 mr-2" />
                  Generar Excel
                </Button>
              </CardContent>
            </Card>

            <Card className="pos-card">
              <CardHeader>
                <CardTitle>Cierre de Caja</CardTitle>
              </CardHeader>
              <CardContent>
                <Button className="w-full pos-button">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Cierre
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card className="pos-card">
            <CardHeader>
              <CardTitle>Productos Más Vendidos</CardTitle>
              <CardDescription>Ranking de productos por unidades vendidas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: 'Cerveza Pilsen 650ml', quantity: 125, revenue: 562.50 },
                  { name: 'Pisco Queirolo 750ml', quantity: 45, revenue: 1300.50 },
                  { name: 'Vodka Absolut 750ml', quantity: 23, revenue: 1495.00 },
                  { name: 'Ron Cartavio 750ml', quantity: 38, revenue: 1729.00 },
                ].map((product, index) => (
                  <div key={product.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="francachela-gradient text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="font-semibold">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {product.quantity} unidades vendidas
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        S/. {product.revenue.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Ingresos
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Sales;
