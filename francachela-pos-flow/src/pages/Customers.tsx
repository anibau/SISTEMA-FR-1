
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  Users,
  Star,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Gift,
  MessageCircle
} from "lucide-react";

interface Customer {
  id: string;
  name: string;
  dni: string;
  phone: string;
  email?: string;
  address?: string;
  birthday?: Date;
  points: number;
  totalSpent: number;
  totalPurchases: number;
  lastPurchase: Date;
  creditLimit: number;
  currentDebt: number;
  status: 'active' | 'inactive' | 'vip';
  registeredAt: Date;
}

const sampleCustomers: Customer[] = [
  {
    id: "1",
    name: "Carlos Mendoza",
    dni: "12345678",
    phone: "+51987654321",
    email: "carlos@email.com",
    address: "Av. Larco 123, Miraflores",
    birthday: new Date("1985-06-15"),
    points: 179,
    totalSpent: 895.50,
    totalPurchases: 15,
    lastPurchase: new Date("2024-01-15"),
    creditLimit: 200.00,
    currentDebt: 45.50,
    status: 'vip',
    registeredAt: new Date("2023-08-10")
  },
  {
    id: "2",
    name: "Ana García",
    dni: "87654321",
    phone: "+51987654322",
    email: "ana@email.com",
    birthday: new Date("1990-03-22"),
    points: 144,
    totalSpent: 720.00,
    totalPurchases: 12,
    lastPurchase: new Date("2024-01-12"),
    creditLimit: 150.00,
    currentDebt: 0,
    status: 'active',
    registeredAt: new Date("2023-09-05")
  },
  {
    id: "3",
    name: "Luis Rodríguez",
    dni: "11223344",
    phone: "+51987654323",
    birthday: new Date("1988-11-08"),
    points: 130,
    totalSpent: 650.30,
    totalPurchases: 10,
    lastPurchase: new Date("2024-01-10"),
    creditLimit: 100.00,
    currentDebt: 25.00,
    status: 'active',
    registeredAt: new Date("2023-10-12")
  },
  {
    id: "4",
    name: "María Torres",
    dni: "55667788",
    phone: "+51987654324",
    email: "maria@email.com",
    address: "Jr. Lima 456, San Isidro",
    birthday: new Date("1992-07-30"),
    points: 96,
    totalSpent: 480.75,
    totalPurchases: 8,
    lastPurchase: new Date("2024-01-08"),
    creditLimit: 80.00,
    currentDebt: 0,
    status: 'active',
    registeredAt: new Date("2023-11-20")
  }
];

const Customers = () => {
  const [customers, setCustomers] = useState<Customer[]>(sampleCustomers);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const statusOptions = ["Todos", "active", "vip", "inactive"];

  // Filtrar clientes
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.dni.includes(searchTerm) ||
                         customer.phone.includes(searchTerm);
    
    const matchesStatus = selectedStatus === "Todos" || customer.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Estadísticas
  const totalCustomers = customers.length;
  const vipCustomers = customers.filter(c => c.status === 'vip').length;
  const totalDebt = customers.reduce((sum, customer) => sum + customer.currentDebt, 0);
  const totalPoints = customers.reduce((sum, customer) => sum + customer.points, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'vip':
        return { variant: 'default', text: 'VIP', color: 'bg-yellow-500' };
      case 'active':
        return { variant: 'secondary', text: 'Activo', color: 'bg-green-500' };
      case 'inactive':
        return { variant: 'outline', text: 'Inactivo', color: 'bg-gray-500' };
      default:
        return { variant: 'outline', text: status, color: 'bg-gray-500' };
    }
  };

  const isBirthdayToday = (birthday?: Date) => {
    if (!birthday) return false;
    const today = new Date();
    return birthday.getDate() === today.getDate() && birthday.getMonth() === today.getMonth();
  };

  const isBirthdayThisWeek = (birthday?: Date) => {
    if (!birthday) return false;
    const today = new Date();
    const thisYear = new Date(today.getFullYear(), birthday.getMonth(), birthday.getDate());
    const diffTime = thisYear.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Clientes</h1>
          <p className="text-muted-foreground">
            Gestión de clientes, puntos de fidelidad y créditos
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button className="pos-button">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Estadísticas de clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalCustomers}</div>
            <p className="text-xs text-muted-foreground">clientes registrados</p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clientes VIP</CardTitle>
            <Star className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{vipCustomers}</div>
            <p className="text-xs text-muted-foreground">clientes premium</p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Créditos Otorgados</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">S/. {totalDebt.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">por cobrar</p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntos Acumulados</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{totalPoints}</div>
            <p className="text-xs text-muted-foreground">puntos totales</p>
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
                placeholder="Buscar por nombre, DNI o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pos-button !p-3"
              />
            </div>
          </div>
          
          {/* Estado de clientes */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {statusOptions.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className="whitespace-nowrap touch-target"
              >
                {status === "Todos" ? status : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">Todos</TabsTrigger>
          <TabsTrigger value="birthdays">Cumpleaños</TabsTrigger>
          <TabsTrigger value="debt">Con Deuda</TabsTrigger>
          <TabsTrigger value="vip">VIP</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <Card className="pos-card">
            <CardHeader>
              <CardTitle>Lista de Clientes ({filteredCustomers.length})</CardTitle>
              <CardDescription>Todos los clientes registrados en el sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredCustomers.map((customer) => {
                    const statusBadge = getStatusBadge(customer.status);
                    const isBirthday = isBirthdayToday(customer.birthday);
                    
                    return (
                      <div
                        key={customer.id}
                        className={`border rounded-xl p-4 hover:shadow-md transition-all duration-200 ${
                          isBirthday ? 'border-yellow-300 bg-yellow-50' : ''
                        }`}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                          {/* Información del cliente */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  <h3 className="font-semibold text-lg">{customer.name}</h3>
                                  {isBirthday && (
                                    <Badge className="bg-yellow-500 text-white">
                                      🎂 Cumpleaños
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                  DNI: {customer.dni} • Tel: {customer.phone}
                                </p>
                                {customer.email && (
                                  <p className="text-xs text-muted-foreground">
                                    📧 {customer.email}
                                  </p>
                                )}
                              </div>
                              <Badge variant={statusBadge.variant as any}>
                                {statusBadge.text}
                              </Badge>
                            </div>
                            
                            {/* Métricas del cliente */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <span className="text-muted-foreground">Puntos:</span>
                                <div className="font-semibold text-green-600">
                                  {customer.points}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Total gastado:</span>
                                <div className="font-semibold text-primary">
                                  S/. {customer.totalSpent.toFixed(2)}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Compras:</span>
                                <div className="font-semibold">
                                  {customer.totalPurchases}
                                </div>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Deuda:</span>
                                <div className={`font-semibold ${
                                  customer.currentDebt > 0 ? 'text-orange-600' : 'text-green-600'
                                }`}>
                                  S/. {customer.currentDebt.toFixed(2)}
                                </div>
                              </div>
                            </div>

                            {/* Información adicional */}
                            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
                              {customer.birthday && (
                                <span className="flex items-center space-x-1">
                                  <Calendar className="h-3 w-3" />
                                  <span>Cumple: {customer.birthday.toLocaleDateString()}</span>
                                </span>
                              )}
                              {customer.address && (
                                <span className="flex items-center space-x-1">
                                  <MapPin className="h-3 w-3" />
                                  <span>{customer.address}</span>
                                </span>
                              )}
                              <span>Última compra: {customer.lastPurchase.toLocaleDateString()}</span>
                            </div>
                          </div>

                          {/* Acciones */}
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="touch-target">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="touch-target">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="touch-target text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Barra de crédito */}
                        {customer.creditLimit > 0 && (
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-muted-foreground mb-1">
                              <span>Crédito utilizado</span>
                              <span>S/. {customer.currentDebt.toFixed(2)} / S/. {customer.creditLimit.toFixed(2)}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all ${
                                  customer.currentDebt / customer.creditLimit > 0.8
                                    ? 'bg-red-500'
                                    : customer.currentDebt / customer.creditLimit > 0.5
                                      ? 'bg-orange-500'
                                      : 'bg-green-500'
                                }`}
                                style={{
                                  width: `${Math.min(100, (customer.currentDebt / customer.creditLimit) * 100)}%`
                                }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  
                  {filteredCustomers.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No se encontraron clientes</h3>
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

        <TabsContent value="birthdays" className="space-y-4">
          <Card className="pos-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Cumpleaños de la Semana
              </CardTitle>
              <CardDescription>Clientes que cumplen años esta semana</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customers
                  .filter(customer => isBirthdayThisWeek(customer.birthday))
                  .map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {customer.birthday?.toLocaleDateString()} 
                          {isBirthdayToday(customer.birthday) && " - ¡HOY!"}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="touch-target">
                          <Gift className="h-4 w-4 mr-1" />
                          Promoción Especial
                        </Button>
                        <Button variant="outline" size="sm" className="touch-target">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          WhatsApp
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debt" className="space-y-4">
          <Card className="pos-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <CreditCard className="h-5 w-5 mr-2" />
                Clientes con Deuda
              </CardTitle>
              <CardDescription>Clientes que tienen créditos pendientes de pago</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customers
                  .filter(customer => customer.currentDebt > 0)
                  .sort((a, b) => b.currentDebt - a.currentDebt)
                  .map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                      <div>
                        <h3 className="font-semibold">{customer.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Deuda: S/. {customer.currentDebt.toFixed(2)} / Límite: S/. {customer.creditLimit.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="touch-target">
                          Registrar Pago
                        </Button>
                        <Button variant="outline" size="sm" className="touch-target">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          Recordatorio
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="vip" className="space-y-4">
          <Card className="pos-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2 text-yellow-500" />
                Clientes VIP
              </CardTitle>
              <CardDescription>Clientes con estatus premium y beneficios especiales</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {customers
                  .filter(customer => customer.status === 'vip')
                  .sort((a, b) => b.totalSpent - a.totalSpent)
                  .map((customer) => (
                    <div key={customer.id} className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <div>
                        <h3 className="font-semibold flex items-center">
                          {customer.name}
                          <Star className="h-4 w-4 ml-2 text-yellow-500 fill-yellow-500" />
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Total gastado: S/. {customer.totalSpent.toFixed(2)} • {customer.points} puntos
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <Button size="sm" className="touch-target">
                          <Gift className="h-4 w-4 mr-1" />
                          Beneficio Especial
                        </Button>
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

export default Customers;
