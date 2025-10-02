import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { expenseService } from "@/services";
import { Expense, ExpenseCategory } from "@/types/system.types";
import {
  CircleDollarSign,
  FileText,
  Calendar,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Download,
  Check,
  Ban,
  Upload,
  CalendarDays,
  Tag,
  Wallet
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { showSuccess, showError, showWarning } from "@/lib/toast";

const ExpensesPage = () => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("todos");
  
  // Filtros
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("");
  const [dateRange, setDateRange] = useState<{ start?: Date; end?: Date }>({});
  
  // Estado para formulario de gasto
  const [showExpenseDialog, setShowExpenseDialog] = useState(false);
  const [expenseForm, setExpenseForm] = useState<{
    amount: string;
    category: string;
    description: string;
    date: string;
    paymentMethod: string;
    tags: string;
  }>({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    paymentMethod: "efectivo",
    tags: ""
  });
  
  // Estado para vista detalle
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [showDetailDialog, setShowDetailDialog] = useState(false);
  
  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Cargar categorías
        const categoriesData = await expenseService.getExpenseCategories();
        setCategories(categoriesData);
        
        // Cargar gastos
        await loadExpenses();
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        showError("Error al cargar los datos de gastos");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);
  
  const loadExpenses = async () => {
    setIsLoading(true);
    try {
      const approvedFilter = activeTab === "pendientes" ? false : 
                            activeTab === "aprobados" ? true : undefined;
      
      const expensesData = await expenseService.getExpenses(
        dateRange.start,
        dateRange.end,
        categoryFilter || undefined,
        approvedFilter
      );
      setExpenses(expensesData);
    } catch (error) {
      console.error("Error al cargar gastos:", error);
      showError("Error al cargar la lista de gastos");
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    loadExpenses();
  }, [activeTab, categoryFilter, dateRange]);
  
  const handleCreateExpense = async () => {
    if (!expenseForm.amount || !expenseForm.category || !expenseForm.description) {
      showWarning("Por favor completa todos los campos obligatorios");
      return;
    }
    
    const amount = parseFloat(expenseForm.amount);
    if (isNaN(amount) || amount <= 0) {
      showWarning("Por favor ingresa un monto válido");
      return;
    }
    
    setIsLoading(true);
    try {
      const tagList = expenseForm.tags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag);
        
      const newExpense = await expenseService.createExpense({
        amount,
        category: expenseForm.category,
        description: expenseForm.description,
        date: new Date(expenseForm.date),
        paymentMethod: expenseForm.paymentMethod,
        approved: false,
        tags: tagList.length > 0 ? tagList : undefined
      });
      
      setExpenses(prev => [newExpense, ...prev]);
      setShowExpenseDialog(false);
      showSuccess("Gasto registrado correctamente");
      
      // Reiniciar formulario
      setExpenseForm({
        amount: "",
        category: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        paymentMethod: "efectivo",
        tags: ""
      });
    } catch (error) {
      console.error("Error al crear gasto:", error);
      showError("Error al registrar el gasto");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleApproveExpense = async (id: string, approve: boolean) => {
    setIsLoading(true);
    try {
      const updatedExpense = await expenseService.approveExpense(id, approve);
      setExpenses(prev => prev.map(expense => 
        expense.id === id ? updatedExpense : expense
      ));
      showSuccess(approve 
        ? "Gasto aprobado correctamente" 
        : "Gasto rechazado correctamente"
      );
    } catch (error) {
      console.error("Error al aprobar/rechazar gasto:", error);
      showError("Error al actualizar el estado del gasto");
    } finally {
      setIsLoading(false);
    }
  };
  
  const viewExpenseDetails = (expense: Expense) => {
    setSelectedExpense(expense);
    setShowDetailDialog(true);
  };
  
  // Filtrar gastos basado en búsqueda
  const filteredExpenses = expenses.filter(expense => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      expense.description.toLowerCase().includes(searchLower) ||
      expense.category.toLowerCase().includes(searchLower) ||
      expense.tags?.some(tag => tag.toLowerCase().includes(searchLower))
    );
  });
  
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
  
  // Calcular totales
  const calculateTotals = () => {
    const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const pendingTotal = filteredExpenses
      .filter(expense => !expense.approved)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const approvedTotal = filteredExpenses
      .filter(expense => expense.approved)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    const totalByCategory: Record<string, number> = {};
    filteredExpenses.forEach(expense => {
      if (!totalByCategory[expense.category]) {
        totalByCategory[expense.category] = 0;
      }
      totalByCategory[expense.category] += expense.amount;
    });
    
    return {
      total,
      pendingTotal,
      approvedTotal,
      totalByCategory
    };
  };
  
  const totals = calculateTotals();

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Control de Gastos</h1>
        <Button onClick={() => setShowExpenseDialog(true)}>
          <Plus className="mr-2 h-4 w-4" /> Registrar Gasto
        </Button>
      </div>
      
      {/* Resumen y filtros */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center">
              <CircleDollarSign className="mr-2 h-5 w-5" /> Resumen de Gastos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total Gastos:</span>
                <span className="font-medium">{formatCurrency(totals.total)}</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Pendientes:</span>
                <span className="font-medium text-yellow-600">
                  {formatCurrency(totals.pendingTotal)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Aprobados:</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(totals.approvedTotal)}
                </span>
              </div>
              <Separator />
              <div className="pt-2">
                <h4 className="text-sm font-medium mb-2">Por categoría:</h4>
                <ScrollArea className="h-[100px]">
                  <div className="space-y-1">
                    {Object.entries(totals.totalByCategory)
                      .sort(([, a], [, b]) => b - a)
                      .map(([category, amount]) => (
                        <div key={category} className="flex justify-between items-center text-sm">
                          <span>{category}</span>
                          <span>{formatCurrency(amount)}</span>
                        </div>
                      ))
                    }
                  </div>
                </ScrollArea>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="searchTerm" className="mb-1 block">Buscar</Label>
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="searchTerm"
                    placeholder="Buscar gastos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="categoryFilter" className="mb-1 block">Categoría</Label>
                <select
                  id="categoryFilter"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                >
                  <option value="">Todas las categorías</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <Label htmlFor="dateFilter" className="mb-1 block">Período</Label>
                <div className="flex space-x-2">
                  <Input 
                    id="dateFilter" 
                    type="date"
                    value={dateRange.start?.toISOString().split("T")[0] || ""}
                    onChange={(e) => setDateRange({
                      ...dateRange,
                      start: e.target.value ? new Date(e.target.value) : undefined
                    })}
                  />
                  <Input 
                    type="date"
                    value={dateRange.end?.toISOString().split("T")[0] || ""}
                    onChange={(e) => setDateRange({
                      ...dateRange,
                      end: e.target.value ? new Date(e.target.value) : undefined
                    })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Listado de gastos */}
      <Card>
        <CardHeader className="pb-2">
          <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="todos">Todos</TabsTrigger>
                <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
                <TabsTrigger value="aprobados">Aprobados</TabsTrigger>
              </TabsList>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" /> Exportar
              </Button>
            </div>
          </Tabs>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : filteredExpenses.length === 0 ? (
            <div className="text-center py-20">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No hay gastos registrados</h3>
              <p className="text-muted-foreground mb-4">
                No se encontraron gastos con los filtros actuales
              </p>
              <Button onClick={() => setShowExpenseDialog(true)}>
                <Plus className="mr-2 h-4 w-4" /> Registrar Gasto
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                <div className="col-span-2">Fecha</div>
                <div className="col-span-3">Descripción</div>
                <div className="col-span-2">Categoría</div>
                <div className="col-span-2">Método de Pago</div>
                <div className="col-span-1 text-right">Monto</div>
                <div className="col-span-1 text-center">Estado</div>
                <div className="col-span-1 text-right">Acciones</div>
              </div>
              <div className="divide-y">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="grid grid-cols-12 items-center p-3 hover:bg-muted/30 transition-colors">
                    <div className="col-span-2 text-sm">
                      {formatDate(expense.date)}
                    </div>
                    <div className="col-span-3">
                      <div className="font-medium truncate" title={expense.description}>
                        {expense.description}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {expense.tags?.map((tag, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="col-span-2 text-sm">
                      {expense.category}
                    </div>
                    <div className="col-span-2 text-sm capitalize">
                      {expense.paymentMethod}
                    </div>
                    <div className="col-span-1 text-right font-medium">
                      {formatCurrency(expense.amount)}
                    </div>
                    <div className="col-span-1 text-center">
                      {expense.approved ? (
                        <Badge className="bg-green-500">Aprobado</Badge>
                      ) : (
                        <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                          Pendiente
                        </Badge>
                      )}
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
                          <DropdownMenuItem onClick={() => viewExpenseDetails(expense)}>
                            Ver detalles
                          </DropdownMenuItem>
                          {!expense.approved && user?.role === 'admin' && (
                            <DropdownMenuItem onClick={() => handleApproveExpense(expense.id, true)}>
                              Aprobar gasto
                            </DropdownMenuItem>
                          )}
                          {!expense.approved && (
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleApproveExpense(expense.id, false)}>
                              Rechazar gasto
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
      
      {/* Diálogo para registrar nuevo gasto */}
      <Dialog open={showExpenseDialog} onOpenChange={setShowExpenseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
            <DialogDescription>
              Completa el formulario para registrar un nuevo gasto
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="expenseAmount">Monto (S/)</Label>
              <div className="relative">
                <CircleDollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expenseAmount"
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="0.00"
                  className="pl-8"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm({...expenseForm, amount: e.target.value})}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expenseCategory">Categoría</Label>
              <select
                id="expenseCategory"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({...expenseForm, category: e.target.value})}
                disabled={isLoading}
              >
                <option value="">Selecciona una categoría...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expenseDescription">Descripción</Label>
              <Input
                id="expenseDescription"
                placeholder="Describe el motivo del gasto"
                value={expenseForm.description}
                onChange={(e) => setExpenseForm({...expenseForm, description: e.target.value})}
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expenseDate">Fecha</Label>
              <div className="relative">
                <CalendarDays className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expenseDate"
                  type="date"
                  className="pl-8"
                  value={expenseForm.date}
                  onChange={(e) => setExpenseForm({...expenseForm, date: e.target.value})}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expensePaymentMethod">Método de Pago</Label>
              <div className="relative">
                <Wallet className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <select
                  id="expensePaymentMethod"
                  className="w-full rounded-md border border-input bg-background px-3 py-2 pl-8"
                  value={expenseForm.paymentMethod}
                  onChange={(e) => setExpenseForm({...expenseForm, paymentMethod: e.target.value})}
                  disabled={isLoading}
                >
                  <option value="efectivo">Efectivo</option>
                  <option value="yape">Yape</option>
                  <option value="plin">Plin</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="tarjeta">Tarjeta</option>
                </select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="expenseTags">Etiquetas (separadas por comas)</Label>
              <div className="relative">
                <Tag className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="expenseTags"
                  placeholder="stock, proveedor, etc."
                  className="pl-8"
                  value={expenseForm.tags}
                  onChange={(e) => setExpenseForm({...expenseForm, tags: e.target.value})}
                  disabled={isLoading}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Comprobante (opcional)</Label>
              <div className="border-2 border-dashed rounded-md p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-1">
                  Arrastra un archivo o haz clic para subir
                </p>
                <p className="text-xs text-muted-foreground">
                  Formatos aceptados: JPG, PNG, PDF (máx 5MB)
                </p>
                <Input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  disabled={isLoading}
                />
                <Button variant="secondary" size="sm" className="mt-2">
                  Seleccionar archivo
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowExpenseDialog(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleCreateExpense} disabled={isLoading}>
              {isLoading ? "Procesando..." : "Registrar Gasto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Diálogo para ver detalles de gasto */}
      <Dialog open={showDetailDialog} onOpenChange={setShowDetailDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalle del Gasto</DialogTitle>
          </DialogHeader>
          {selectedExpense && (
            <div className="space-y-4 py-2">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{selectedExpense.description}</h3>
                <div>
                  {selectedExpense.approved ? (
                    <Badge className="bg-green-500">Aprobado</Badge>
                  ) : (
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                      Pendiente
                    </Badge>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Monto:</p>
                  <p className="font-medium text-lg">{formatCurrency(selectedExpense.amount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Fecha:</p>
                  <p>{formatDate(selectedExpense.date)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Categoría:</p>
                  <p>{selectedExpense.category}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Método de Pago:</p>
                  <p className="capitalize">{selectedExpense.paymentMethod}</p>
                </div>
                
                {selectedExpense.tags && selectedExpense.tags.length > 0 && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-1">Etiquetas:</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedExpense.tags.map((tag, idx) => (
                        <Badge key={idx} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {selectedExpense.receipt && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground mb-1">Comprobante:</p>
                    <div className="border rounded-md p-2">
                      <a 
                        href={selectedExpense.receipt} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-600 hover:underline"
                      >
                        <FileText className="mr-2 h-4 w-4" />
                        Ver comprobante
                      </a>
                    </div>
                  </div>
                )}
                
                {selectedExpense.approved && selectedExpense.approvedBy && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Aprobado por:</p>
                    <p>{selectedExpense.approvedBy}</p>
                  </div>
                )}
              </div>
              
              {!selectedExpense.approved && user?.role === 'admin' && (
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    variant="outline" 
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => {
                      handleApproveExpense(selectedExpense.id, false);
                      setShowDetailDialog(false);
                    }}
                  >
                    <Ban className="mr-2 h-4 w-4" /> Rechazar
                  </Button>
                  <Button 
                    variant="default"
                    onClick={() => {
                      handleApproveExpense(selectedExpense.id, true);
                      setShowDetailDialog(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4" /> Aprobar
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ExpensesPage;