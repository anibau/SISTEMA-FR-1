
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Star,
  Clock,
  Calendar,
  Award,
  Calculator
} from "lucide-react";

// Datos de ejemplo para los gráficos
const salesData = [
  { name: 'Ene', ventas: 4200, productos: 180 },
  { name: 'Feb', ventas: 3800, productos: 165 },
  { name: 'Mar', ventas: 5100, productos: 220 },
  { name: 'Abr', ventas: 4700, productos: 195 },
  { name: 'May', ventas: 5500, productos: 240 },
  { name: 'Jun', ventas: 6200, productos: 275 },
];

const topProducts = [
  { name: 'Cerveza Pilsen', ventas: 125, ingresos: 562.50 },
  { name: 'Pisco Queirolo', ventas: 45, ingresos: 1300.50 },
  { name: 'Vodka Absolut', ventas: 23, ingresos: 1495.00 },
  { name: 'Ron Cartavio', ventas: 38, ingresos: 1729.00 },
  { name: 'Whisky J.Walker', ventas: 12, ingresos: 1078.80 },
];

const categoryData = [
  { name: 'Cerveza', value: 35, color: '#293155' },
  { name: 'Licores', value: 28, color: '#322B42' },
  { name: 'Vinos', value: 20, color: '#BBBAC5' },
  { name: 'Pisco', value: 17, color: '#1F1D2E' },
];

const topCustomers = [
  { name: 'Carlos Mendoza', compras: 15, total: 895.50, puntos: 179 },
  { name: 'Ana García', compras: 12, total: 720.00, puntos: 144 },
  { name: 'Luis Rodríguez', compras: 10, total: 650.30, puntos: 130 },
  { name: 'María Torres', compras: 8, total: 480.75, puntos: 96 },
];

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Resumen de ventas y métricas importantes de tu licorería
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <div className="text-right">
            <div className="text-sm text-muted-foreground">Última actualización</div>
            <div className="font-semibold">{new Date().toLocaleString()}</div>
          </div>
        </div>
      </div>

      {/* KPIs principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas Hoy</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">S/. 2,450.75</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.5% vs ayer
            </div>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tickets Procesados</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">47</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +8.2% vs ayer
            </div>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ticket Promedio</CardTitle>
            <Calculator className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">S/. 52.14</div>
            <div className="flex items-center text-xs text-red-600 mt-1">
              <TrendingDown className="h-3 w-3 mr-1" />
              -3.1% vs ayer
            </div>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes Activos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">156</div>
            <div className="flex items-center text-xs text-green-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +5 nuevos esta semana
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas mensuales */}
        <Card className="pos-card">
          <CardHeader>
            <CardTitle>Ventas por Mes</CardTitle>
            <CardDescription>
              Evolución de ventas e items vendidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  name="Ventas (S/.)"
                />
                <Line 
                  type="monotone" 
                  dataKey="productos" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={2}
                  name="Productos vendidos"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribución por categorías */}
        <Card className="pos-card">
          <CardHeader>
            <CardTitle>Ventas por Categoría</CardTitle>
            <CardDescription>
              Distribución de ventas por tipo de producto
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={(entry) => `${entry.name}: ${entry.value}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="productos" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="productos">Top Productos</TabsTrigger>
          <TabsTrigger value="clientes">Top Clientes</TabsTrigger>
          <TabsTrigger value="horarios">Por Horarios</TabsTrigger>
          <TabsTrigger value="alertas">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="productos" className="space-y-4">
          <Card className="pos-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Productos Más Vendidos
              </CardTitle>
              <CardDescription>
                Ranking de productos por unidades vendidas este mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.name} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="francachela-gradient text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {product.ventas} unidades vendidas
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        S/. {product.ingresos.toFixed(2)}
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

        <TabsContent value="clientes" className="space-y-4">
          <Card className="pos-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Award className="h-5 w-5 mr-2" />
                Clientes Más Frecuentes
              </CardTitle>
              <CardDescription>
                Ranking de clientes por frecuencia de compra
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topCustomers.map((customer, index) => (
                  <div key={customer.name} className="flex items-center space-x-4 p-3 border rounded-lg">
                    <div className="francachela-gradient text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold">{customer.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {customer.compras} compras | {customer.puntos} puntos
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-primary">
                        S/. {customer.total.toFixed(2)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total gastado
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="horarios" className="space-y-4">
          <Card className="pos-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Ventas por Horario
              </CardTitle>
              <CardDescription>
                Distribución de ventas durante el día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={[
                  { hora: '9-11', ventas: 180 },
                  { hora: '11-13', ventas: 290 },
                  { hora: '13-15', ventas: 420 },
                  { hora: '15-17', ventas: 380 },
                  { hora: '17-19', ventas: 650 },
                  { hora: '19-21', ventas: 530 },
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hora" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="ventas" fill="hsl(var(--primary))" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="alertas" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="pos-card border-orange-200">
              <CardHeader>
                <CardTitle className="text-orange-600 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Stock Bajo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Vodka Absolut</span>
                    <span className="text-orange-600 font-semibold">8 unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Whisky J.Walker</span>
                    <span className="text-orange-600 font-semibold">6 unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pisco Premium</span>
                    <span className="text-orange-600 font-semibold">4 unidades</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="pos-card border-red-200">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center">
                  <Package className="h-5 w-5 mr-2" />
                  Productos Agotados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Cerveza Corona</span>
                    <span className="text-red-600 font-semibold">0 unidades</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Ron Bacardi</span>
                    <span className="text-red-600 font-semibold">0 unidades</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="pos-card border-green-200">
              <CardHeader>
                <CardTitle className="text-green-600 flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Promociones Activas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="font-semibold">3x2 en Cervezas</div>
                    <div className="text-muted-foreground">Vence en 5 días</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">20% OFF Vinos</div>
                    <div className="text-muted-foreground">Vence en 12 días</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="pos-card border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-600 flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Cumpleaños
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-sm">
                    <div className="font-semibold">Carlos Mendoza</div>
                    <div className="text-muted-foreground">Hoy - Enviar promoción especial</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-semibold">Ana García</div>
                    <div className="text-muted-foreground">Mañana - Preparar descuento</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
