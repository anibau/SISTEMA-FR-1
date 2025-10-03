import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { pointsService } from "@/services";
import { Customer, PointsTransaction, PointsConfig } from "@/types/system.types";
import {
  Award,
  Users,
  Gift,
  Search,
  Plus,
  Settings,
  TrendingUp,
  Calendar,
  ChevronRight,
  BarChart3,
  CircleDollarSign,
  MoreVertical,
  Star,
  Download,
  History,
  RefreshCw,
  Tag,
  User
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const PointsPage = () => {
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [transactions, setTransactions] = useState<PointsTransaction[]>([]);
  const [pointsConfig, setPointsConfig] = useState<PointsConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("clientes");
  
  // Estado para búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  
  // Estado para diálogos
  const [showTransactionDialog, setShowTransactionDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [showCustomerPointsDialog, setShowCustomerPointsDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  
  // Estado para formularios
  const [transactionForm, setTransactionForm] = useState({
    customerId: "",
    type: "add",
    points: "",
    reason: "",
    description: "",
  });
  
  const [configForm, setConfigForm] = useState<{
    pointsPerPurchaseAmount: string;
    pointsExpirationDays: string;
    minimumRedeemPoints: string;
    pointValueInCurrency: string;
    welcomePoints: string;
    birthdayPoints: string;
    referralPoints: string;
    enabled: boolean;
  }>({
    pointsPerPurchaseAmount: "",
    pointsExpirationDays: "",
    minimumRedeemPoints: "",
    pointValueInCurrency: "",
    welcomePoints: "",
    birthdayPoints: "",
    referralPoints: "",
    enabled: true
  });
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Cargar configuración de puntos
        const config = await pointsService.getPointsConfig();
        setPointsConfig(config);
        
        if (config) {
          setConfigForm({
            pointsPerPurchaseAmount: config.pointsPerPurchaseAmount.toString(),
            pointsExpirationDays: config.pointsExpirationDays.toString(),
            minimumRedeemPoints: config.minimumRedeemPoints.toString(),
            pointValueInCurrency: config.pointValueInCurrency.toString(),
            welcomePoints: config.welcomePoints.toString(),
            birthdayPoints: config.birthdayPoints.toString(),
            referralPoints: config.referralPoints.toString(),
            enabled: config.enabled
          });
        }
        
        // Cargar clientes con puntos
        const customersData = await pointsService.getCustomersWithPoints();
        setCustomers(customersData);
        
        // Cargar transacciones de puntos
        const transactionsData = await pointsService.getPointsTransactions();
        setTransactions(transactionsData);
        
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        showError("Error al cargar los datos del sistema de puntos");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  // Actualizar transacciones cuando cambian filtros
  useEffect(() => {
    const loadTransactions = async () => {
      setIsLoading(true);
      try {
        const transactionsData = await pointsService.getPointsTransactions(
          dateRange.start,
          dateRange.end
        );
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error al cargar transacciones:", error);
        showError("Error al cargar el historial de transacciones");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (activeTab === "transacciones") {
      loadTransactions();
    }
  }, [activeTab, dateRange]);
  
  // Manejar creación de transacción
  const handleCreateTransaction = async () => {
    if (!transactionForm.customerId || !transactionForm.points || !transactionForm.reason) {
      showWarning("Por favor completa todos los campos obligatorios");
      return;
    }
    
    const points = parseInt(transactionForm.points);
    if (isNaN(points) || points <= 0) {
      showWarning("Por favor ingresa una cantidad válida de puntos");
      return;
    }
    
    setIsLoading(true);
    try {
      const newTransaction = await pointsService.createPointsTransaction({
        customerId: transactionForm.customerId,
        type: transactionForm.type as "add" | "redeem",
        points,
        reason: transactionForm.reason,
        description: transactionForm.description || undefined,
      });
      
      setTransactions(prev => [newTransaction, ...prev]);
      
      // Actualizar puntos del cliente
      const updatedCustomers = customers.map(customer => {
        if (customer.id === transactionForm.customerId) {
          const pointsChange = transactionForm.type === "add" ? points : -points;
          return {
            ...customer,
            points: customer.points + pointsChange
          };
        }
        return customer;
      });
      
      setCustomers(updatedCustomers);
      setShowTransactionDialog(false);
      showSuccess(transactionForm.type === "add" 
        ? "Puntos añadidos correctamente" 
        : "Puntos canjeados correctamente");
      
      // Reiniciar formulario
      setTransactionForm({
        customerId: "",
        type: "add",
        points: "",
        reason: "",
        description: "",
      });
    } catch (error) {
      console.error("Error al crear transacción:", error);
      showError("Error al procesar la transacción de puntos");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Manejar actualización de configuración
  const handleUpdateConfig = async () => {
    if (!configForm.pointsPerPurchaseAmount || !configForm.pointsExpirationDays || 
        !configForm.minimumRedeemPoints || !configForm.pointValueInCurrency) {
      showWarning("Por favor completa todos los campos obligatorios");
      return;
    }
    
    setIsLoading(true);
    try {
      const updatedConfig = await pointsService.updatePointsConfig({
        pointsPerPurchaseAmount: parseFloat(configForm.pointsPerPurchaseAmount),
        pointsExpirationDays: parseInt(configForm.pointsExpirationDays),
        minimumRedeemPoints: parseInt(configForm.minimumRedeemPoints),
        pointValueInCurrency: parseFloat(configForm.pointValueInCurrency),
        welcomePoints: parseInt(configForm.welcomePoints),
        birthdayPoints: parseInt(configForm.birthdayPoints),
        referralPoints: parseInt(configForm.referralPoints),
        enabled: configForm.enabled
      });
      
      setPointsConfig(updatedConfig);
      setShowConfigDialog(false);
      showSuccess("Configuración actualizada correctamente");
    } catch (error) {
      console.error("Error al actualizar configuración:", error);
      showError("Error al actualizar la configuración del sistema de puntos");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Ver historial de puntos de un cliente
  const viewCustomerPoints = (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowCustomerPointsDialog(true);
  };
  
  // Filtrar clientes basado en búsqueda
  const filteredCustomers = customers.filter(customer => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      customer.name.toLowerCase().includes(searchLower) ||
      customer.email?.toLowerCase().includes(searchLower) ||
      customer.phone?.includes(searchTerm)
    );
  });
  
  // Filtrar transacciones basado en búsqueda
  const filteredTransactions = transactions.filter(transaction => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      transaction.customerName.toLowerCase().includes(searchLower) ||
      transaction.reason.toLowerCase().includes(searchLower) ||
      transaction.description?.toLowerCase().includes(searchLower)
    );
  });
  
  // Obtener transacciones de un cliente específico
  const getCustomerTransactions = (customerId: string) => {
    return transactions.filter(transaction => transaction.customerId === customerId);
  };
  
  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };
  
  // Formatear fecha
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };
  
  return (
    <div className="container mx-auto p-6 bg-background min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sistema de Puntos</h1>
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="border-primary/30 hover:bg-primary/10"
            onClick={() => setShowConfigDialog(true)}
            disabled={user?.role !== 'admin'}
          >
            <Settings className="mr-2 h-4 w-4" /> Configuración
          </Button>
          <Button 
            className="bg-primary hover:bg-primary/90 text-white shadow-md"
            onClick={() => setShowTransactionDialog(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Nueva Transacción
          </Button>
        </div>
      </div>
      
      {/* Resumen y búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="shadow-md border border-border/30 bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <Award className="mr-2 h-5 w-5" /> Resumen de Puntos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Total Clientes</p>
                  <p className="text-2xl font-bold">{customers.length}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-muted-foreground text-xs">Puntos Activos</p>
                  <p className="text-2xl font-bold">
                    {customers.reduce((sum, customer) => sum + customer.points, 0)}
                  </p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Valor Punto:</span>
                  <span className="font-medium">
                    {pointsConfig 
                      ? formatCurrency(pointsConfig.pointValueInCurrency) 
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Ratio Compra:</span>
                  <span className="font-medium">
                    {pointsConfig 
                      ? `${pointsConfig.pointsPerPurchaseAmount} PEN = 1 punto`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Mín. Canje:</span>
                  <span className="font-medium">
                    {pointsConfig?.minimumRedeemPoints || "-"} puntos
                  </span>
                </div>
              </div>
              
              <Separator />
              
              <div className="pt-1">
                <p className="text-muted-foreground text-xs mb-2">Estado del Sistema</p>
                {pointsConfig?.enabled ? (
                  <Badge className="bg-green-500">Activo</Badge>
                ) : (
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                    Inactivo
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2 shadow-md border border-border/30 bg-card">
          <CardHeader className="pb-0">
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <Tabs>
                    <TabsList>
                        <TabsTrigger value="clientes">Clientes</TabsTrigger>
                        <TabsTrigger value="transacciones">Transacciones</TabsTrigger>
                        <TabsTrigger value="analisis">Análisis</TabsTrigger>
                    </TabsList>
                </Tabs>
              </div>
              
              {activeTab === "clientes" && (
                <div className="flex w-full items-center space-x-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar clientes..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
              )}
              
              {activeTab === "transacciones" && (
                <div className="flex w-full items-center space-x-2 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar transacciones..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="flex space-x-1">
                    <Input 
                      type="date"
                      className="w-32"
                      value={dateRange.start?.toISOString().split("T")[0] || ""}
                      onChange={(e) => setDateRange({
                        ...dateRange,
                        start: e.target.value ? new Date(e.target.value) : undefined
                      })}
                    />
                    <Input 
                      type="date"
                      className="w-32"
                      value={dateRange.end?.toISOString().split("T")[0] || ""}
                      onChange={(e) => setDateRange({
                        ...dateRange,
                        end: e.target.value ? new Date(e.target.value) : undefined
                      })}
                    />
                  </div>
                </div>
              )}
              
              {activeTab === "analisis" && (
                <div className="flex w-full justify-between items-center mt-4">
                  <h3 className="font-medium text-sm">Análisis y Tendencias</h3>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" /> Exportar Datos
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="hidden">
                <TabsTrigger value="clientes">Clientes</TabsTrigger>
                <TabsTrigger value="transacciones">Transacciones</TabsTrigger>
                <TabsTrigger value="analisis">Análisis</TabsTrigger>
              </TabsList>
              <TabsContent value="clientes" className="mt-0">
                    {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredCustomers.length === 0 ? (
                <div className="text-center py-10">
                  <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                  <h3 className="text-lg font-medium mb-1">No hay clientes con puntos</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    No se encontraron clientes que participen en el programa de puntos
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                    <div className="col-span-4">Cliente</div>
                    <div className="col-span-2">Puntos</div>
                    <div className="col-span-2">Última Actividad</div>
                    <div className="col-span-2">Valor Equivalente</div>
                    <div className="col-span-2 text-right">Acciones</div>
                  </div>
                  <div className="divide-y">
                    {filteredCustomers.map((customer) => (
                      <div key={customer.id} className="grid grid-cols-12 items-center p-3 hover:bg-muted/30 transition-colors">
                        <div className="col-span-4">
                          <div className="font-medium">{customer.name}</div>
                          <div className="text-sm text-muted-foreground">{customer.email || customer.phone}</div>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-500 mr-1" />
                            <span className="font-medium">{customer.points}</span>
                          </div>
                        </div>
                        <div className="col-span-2 text-sm">
                          {customer.lastPointsActivity ? formatDate(customer.lastPointsActivity) : "Sin actividad"}
                        </div>
                        <div className="col-span-2">
                          {pointsConfig && (
                            <span className="text-green-600 font-medium">
                              {formatCurrency(customer.points * pointsConfig.pointValueInCurrency)}
                            </span>
                          )}
                        </div>
                        <div className="col-span-2 text-right">
                          <div className="flex justify-end space-x-1">
                            <Button variant="ghost" size="sm" onClick={() => viewCustomerPoints(customer)}>
                              <History className="h-4 w-4" />
                              <span className="sr-only">Historial</span>
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => {
                              setTransactionForm({
                                ...transactionForm,
                                customerId: customer.id,
                              });
                              setShowTransactionDialog(true);
                            }}>
                              <Plus className="h-4 w-4" />
                              <span className="sr-only">Añadir</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">Más</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => {
                                  setTransactionForm({
                                    customerId: customer.id,
                                    type: "add",
                                    points: "",
                                    reason: "Añadir puntos",
                                    description: "",
                                  });
                                  setShowTransactionDialog(true);
                                }}>
                                  Añadir puntos
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => {
                                  setTransactionForm({
                                    customerId: customer.id,
                                    type: "redeem",
                                    points: "",
                                    reason: "Canjear puntos",
                                    description: "",
                                  });
                                  setShowTransactionDialog(true);
                                }}>
                                  Canjear puntos
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => viewCustomerPoints(customer)}>
                                  Ver historial
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="transacciones" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : filteredTransactions.length === 0 ? (
                <div className="text-center py-10">
                  <History className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                  <h3 className="text-lg font-medium mb-1">No hay transacciones</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    No se encontraron transacciones con los filtros actuales
                  </p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                    <div className="col-span-3">Cliente</div>
                    <div className="col-span-2">Fecha</div>
                    <div className="col-span-1">Puntos</div>
                    <div className="col-span-2">Tipo</div>
                    <div className="col-span-4">Motivo</div>
                  </div>
                  <div className="divide-y">
                    {filteredTransactions.map((transaction) => (
                      <div key={transaction.id} className="grid grid-cols-12 items-center p-3 hover:bg-muted/30 transition-colors">
                        <div className="col-span-3">
                          <div className="font-medium">{transaction.customerName}</div>
                        </div>
                        <div className="col-span-2 text-sm">
                          {formatDate(transaction.date)}
                        </div>
                        <div className="col-span-1 font-medium">
                          <span className={transaction.type === 'add' ? 'text-green-600' : 'text-red-600'}>
                            {transaction.type === 'add' ? '+' : '-'}{transaction.points}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <Badge 
                            variant={transaction.type === 'add' ? 'default' : 'outline'}
                            className={transaction.type === 'redeem' ? 'border-orange-500 text-orange-500' : ''}
                          >
                            {transaction.type === 'add' ? 'Acumulación' : 'Canje'}
                          </Badge>
                        </div>
                        <div className="col-span-4">
                          <div>{transaction.reason}</div>
                          {transaction.description && (
                            <div className="text-xs text-muted-foreground">{transaction.description}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="analisis" className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Distribución de Puntos</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
                      <BarChart3 className="h-16 w-16 text-muted-foreground opacity-50" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Promedio por Cliente</p>
                        <p className="font-medium">
                          {customers.length 
                            ? Math.round(customers.reduce((sum, c) => sum + c.points, 0) / customers.length) 
                            : 0}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Mediana</p>
                        <p className="font-medium">150</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Actividad de Puntos</CardTitle>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="flex items-center justify-center h-40 bg-muted/30 rounded-md">
                      <TrendingUp className="h-16 w-16 text-muted-foreground opacity-50" />
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Canjes este mes</p>
                        <p className="font-medium">
                          {transactions.filter(t => 
                            t.type === 'redeem' && 
                            new Date(t.date).getMonth() === new Date().getMonth()
                          ).length}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Puntos Redimidos</p>
                        <p className="font-medium">
                          {transactions
                            .filter(t => t.type === 'redeem')
                            .reduce((sum, t) => sum + t.points, 0)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Diálogo para nueva transacción */}
      <Dialog open={showTransactionDialog} onOpenChange={setShowTransactionDialog}>
        <DialogContent className="max-w-md bg-card shadow-lg border border-border/30 bg-white">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {transactionForm.type === "add" ? "Añadir Puntos" : "Canjear Puntos"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {transactionForm.type === "add" 
                ? "Agrega puntos a la cuenta del cliente"
                : "Canjea puntos de la cuenta del cliente"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Tipo de Transacción</Label>
              <div className="flex rounded-md overflow-hidden border border-border/30">
                <Button 
                  type="button"
                  variant={transactionForm.type === "add" ? "default" : "ghost"}
                  className={`flex-1 rounded-none ${transactionForm.type === "add" ? "bg-primary text-white" : "bg-transparent"}`}
                  onClick={() => setTransactionForm({...transactionForm, type: "add"})}
                >
                  <Plus className={`mr-2 h-4 w-4 ${transactionForm.type === "add" ? "text-white" : ""}`} />
                  Añadir Puntos
                </Button>
                <Button 
                  type="button"
                  variant={transactionForm.type === "redeem" ? "default" : "ghost"}
                  className={`flex-1 rounded-none ${transactionForm.type === "redeem" ? "bg-primary text-white" : "bg-transparent"}`}
                  onClick={() => setTransactionForm({...transactionForm, type: "redeem"})}
                >
                  <Star className={`mr-2 h-4 w-4 ${transactionForm.type === "redeem" ? "text-white" : ""}`} />
                  Canjear Puntos
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="customerId">Cliente</Label>
              <Select
                value={transactionForm.customerId}
                onValueChange={(value) => setTransactionForm({...transactionForm, customerId: value})}
                disabled={isLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un cliente..." />
                </SelectTrigger>
                <SelectContent>
                  {customers.map((customer) => (
                    <SelectItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.points} puntos
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="points">Cantidad de Puntos</Label>
              <div className="relative">
                <Star className="absolute left-3 top-2.5 h-4 w-4 text-primary/70" />
                <Input
                  id="points"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="0"
                  className="pl-9 border-primary/30 focus:border-primary/70"
                  value={transactionForm.points}
                  onChange={(e) => setTransactionForm({...transactionForm, points: e.target.value})}
                  disabled={isLoading}
                />
              </div>
              {transactionForm.type === "redeem" && pointsConfig && (
                <div className="text-xs bg-primary/5 p-2 rounded border border-primary/20 mt-1">
                  <p className="font-medium">
                    Valor: <span className="text-primary">{transactionForm.points 
                      ? formatCurrency(parseInt(transactionForm.points) * pointsConfig.pointValueInCurrency)
                      : formatCurrency(0)}</span>
                  </p>
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo</Label>
              <Input
                id="reason"
                placeholder="Motivo de la transacción"
                value={transactionForm.reason}
                onChange={(e) => setTransactionForm({...transactionForm, reason: e.target.value})}
                disabled={isLoading}
                className="border-primary/30 focus:border-primary/70"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Descripción (opcional)</Label>
              <Input
                id="description"
                placeholder="Detalles adicionales"
                value={transactionForm.description}
                onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
                disabled={isLoading}
                className="border-primary/30 focus:border-primary/70"
              />
            </div>
            
            {transactionForm.type === "redeem" && pointsConfig && transactionForm.customerId && (
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 shadow-sm">
                <p className="text-sm font-medium mb-2 flex items-center">
                  <Star className="mr-1 h-4 w-4 text-primary" /> 
                  Información de Canje
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center border-b border-primary/10 pb-1">
                    <span className="text-muted-foreground">Mínimo para canjear:</span>
                    <span className="font-medium">{pointsConfig.minimumRedeemPoints} puntos</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-primary/10 pb-1">
                    <span className="text-muted-foreground">Valor por punto:</span>
                    <span className="font-medium">{formatCurrency(pointsConfig.pointValueInCurrency)}</span>
                  </div>
                  {customers.find(c => c.id === transactionForm.customerId) && (
                    <div className="flex justify-between items-center pt-1">
                      <span className="text-muted-foreground">Puntos disponibles:</span>
                      <span className="font-medium text-primary">
                        {customers.find(c => c.id === transactionForm.customerId)?.points} puntos
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-primary/30 hover:bg-primary/10"
              onClick={() => setShowTransactionDialog(false)} 
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white shadow-sm"
              onClick={handleCreateTransaction} 
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : transactionForm.type === "add" ? "Añadir Puntos" : "Canjear Puntos"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para configuración */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-xl bg-card shadow-lg border border-border/30">
          <DialogHeader>
            <DialogTitle className="text-xl">Configuración del Sistema de Puntos</DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Ajusta los parámetros del sistema de fidelización por puntos
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pointsPerPurchaseAmount">Monto por Punto (S/)</Label>
                <div className="relative">
                  <CircleDollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pointsPerPurchaseAmount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="10.00"
                    className="pl-8"
                    value={configForm.pointsPerPurchaseAmount}
                    onChange={(e) => setConfigForm({...configForm, pointsPerPurchaseAmount: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Cada S/ ingresados = 1 punto</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pointValueInCurrency">Valor del Punto (S/)</Label>
                <div className="relative">
                  <CircleDollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pointValueInCurrency"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.50"
                    className="pl-8"
                    value={configForm.pointValueInCurrency}
                    onChange={(e) => setConfigForm({...configForm, pointValueInCurrency: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Valor en soles de cada punto al canjear</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="pointsExpirationDays">Días para Expirar</Label>
                <div className="relative">
                  <Calendar className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="pointsExpirationDays"
                    type="number"
                    min="1"
                    placeholder="365"
                    className="pl-8"
                    value={configForm.pointsExpirationDays}
                    onChange={(e) => setConfigForm({...configForm, pointsExpirationDays: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Tiempo de validez de los puntos</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="minimumRedeemPoints">Mínimo para Canjear</Label>
                <div className="relative">
                  <Star className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="minimumRedeemPoints"
                    type="number"
                    min="1"
                    placeholder="50"
                    className="pl-8"
                    value={configForm.minimumRedeemPoints}
                    onChange={(e) => setConfigForm({...configForm, minimumRedeemPoints: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Puntos mínimos para permitir canje</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="welcomePoints">Bienvenida</Label>
                <div className="relative">
                  <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="welcomePoints"
                    type="number"
                    min="0"
                    placeholder="10"
                    className="pl-8"
                    value={configForm.welcomePoints}
                    onChange={(e) => setConfigForm({...configForm, welcomePoints: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Puntos por registro</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="birthdayPoints">Cumpleaños</Label>
                <div className="relative">
                  <Gift className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="birthdayPoints"
                    type="number"
                    min="0"
                    placeholder="50"
                    className="pl-8"
                    value={configForm.birthdayPoints}
                    onChange={(e) => setConfigForm({...configForm, birthdayPoints: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Puntos por cumpleaños</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="referralPoints">Referidos</Label>
                <div className="relative">
                  <Users className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="referralPoints"
                    type="number"
                    min="0"
                    placeholder="25"
                    className="pl-8"
                    value={configForm.referralPoints}
                    onChange={(e) => setConfigForm({...configForm, referralPoints: e.target.value})}
                    disabled={isLoading}
                  />
                </div>
                <p className="text-xs text-muted-foreground">Puntos por traer referido</p>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="enabledPoints"
                className="w-4 h-4"
                checked={configForm.enabled}
                onChange={(e) => setConfigForm({...configForm, enabled: e.target.checked})}
                disabled={isLoading}
              />
              <Label htmlFor="enabledPoints" className="flex-1 cursor-pointer">
                Sistema de puntos activo
              </Label>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              className="border-primary/30 hover:bg-primary/10"
              onClick={() => setShowConfigDialog(false)} 
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90 text-white shadow-sm"
              onClick={handleUpdateConfig} 
              disabled={isLoading}
            >
              {isLoading ? "Procesando..." : "Guardar Configuración"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para ver historial de puntos del cliente */}
      <Dialog open={showCustomerPointsDialog} onOpenChange={setShowCustomerPointsDialog}>
        <DialogContent className="max-w-xl bg-card shadow-lg border border-border/30">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Historial de Puntos
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {selectedCustomer?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedCustomer && (
            <>
              <div className="flex justify-between items-center mb-4">
                <div>
                  <p className="text-sm text-muted-foreground">Puntos Actuales</p>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" />
                    <span className="font-medium text-lg">{selectedCustomer.points}</span>
                  </div>
                </div>
                
                {pointsConfig && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Valor Equivalente</p>
                    <p className="font-medium text-lg text-green-600">
                      {formatCurrency(selectedCustomer.points * pointsConfig.pointValueInCurrency)}
                    </p>
                  </div>
                )}
              </div>
              
              <Separator className="my-2" />
              
              <ScrollArea className="h-[300px]">
                <div className="space-y-3 pr-4">
                  {getCustomerTransactions(selectedCustomer.id).length > 0 ? (
                    getCustomerTransactions(selectedCustomer.id)
                      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                      .map(transaction => (
                        <div key={transaction.id} className="border rounded-md p-3">
                          <div className="flex justify-between mb-1">
                            <span className={`font-medium ${transaction.type === 'add' ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.type === 'add' ? '+' : '-'}{transaction.points} puntos
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {formatDate(transaction.date)}
                            </span>
                          </div>
                          <div>
                            <p className="text-sm">{transaction.reason}</p>
                            {transaction.description && (
                              <p className="text-xs text-muted-foreground mt-1">{transaction.description}</p>
                            )}
                          </div>
                        </div>
                      ))
                  ) : (
                    <div className="text-center py-8">
                      <History className="mx-auto h-8 w-8 text-muted-foreground opacity-50 mb-2" />
                      <p className="text-muted-foreground">No hay transacciones para este cliente</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <DialogFooter>
                <div className="flex space-x-2 w-full">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => {
                      setTransactionForm({
                        customerId: selectedCustomer.id,
                        type: "add",
                        points: "",
                        reason: "Añadir puntos",
                        description: "",
                      });
                      setShowCustomerPointsDialog(false);
                      setShowTransactionDialog(true);
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" /> Añadir Puntos
                  </Button>
                  
                  <Button 
                    variant="default"
                    className="flex-1"
                    onClick={() => {
                      setTransactionForm({
                        customerId: selectedCustomer.id,
                        type: "redeem",
                        points: "",
                        reason: "Canjear puntos",
                        description: "",
                      });
                      setShowCustomerPointsDialog(false);
                      setShowTransactionDialog(true);
                    }}
                    disabled={selectedCustomer.points < (pointsConfig?.minimumRedeemPoints || 0)}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" /> Canjear Puntos
                  </Button>
                </div>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PointsPage;