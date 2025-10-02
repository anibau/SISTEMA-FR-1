import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { cashService } from "@/services";
import { CashRegister, CashierShift, ShiftTransaction } from "@/types/system.types";
import { 
  Calculator, 
  Clock, 
  DollarSign, 
  FileText, 
  History, 
  Plus, 
  User, 
  AlertTriangle,
  CheckCircle,
  Ban,
  Search,
  ArrowUpDown,
  CalendarDays
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { showSuccess, showError, showWarning } from "@/lib/toast";

const CashRegisterPage = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("actual");
  const [registers, setRegisters] = useState<CashRegister[]>([]);
  const [currentShift, setCurrentShift] = useState<CashierShift | null>(null);
  const [transactions, setTransactions] = useState<ShiftTransaction[]>([]);
  const [shiftHistory, setShiftHistory] = useState<CashierShift[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDialog, setShowStartDialog] = useState(false);
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [startAmount, setStartAmount] = useState("");
  const [endAmount, setEndAmount] = useState("");
  const [selectedRegister, setSelectedRegister] = useState<string>("");
  const [notes, setNotes] = useState("");
  
  // Estado para transacciones
  const [showAddTransaction, setShowAddTransaction] = useState(false);
  const [transactionType, setTransactionType] = useState<ShiftTransaction["type"]>("sale");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionPaymentMethod, setTransactionPaymentMethod] = useState<ShiftTransaction["paymentMethod"]>("efectivo");
  const [transactionDescription, setTransactionDescription] = useState("");
  const [transactionReference, setTransactionReference] = useState("");

  // Cargar datos iniciales
  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        // Cargar cajas registradoras
        const registersData = await cashService.getRegisters();
        setRegisters(registersData);
        
        // Si hay registros, seleccionar el primero por defecto
        if (registersData.length > 0) {
          setSelectedRegister(registersData[0].id);
        }
        
        // Cargar turno actual si existe
        const currentShiftData = await cashService.getCurrentShift();
        setCurrentShift(currentShiftData);
        
        // Si hay un turno activo, cargar sus transacciones
        if (currentShiftData) {
          const transactionsData = await cashService.getShiftTransactions(currentShiftData.id);
          setTransactions(transactionsData);
        }
        
        // Cargar historial de turnos
        loadShiftHistory();
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
        showError("Error al cargar los datos de caja");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadInitialData();
  }, []);

  const loadShiftHistory = async () => {
    try {
      const history = await cashService.getShiftHistory();
      setShiftHistory(history);
    } catch (error) {
      console.error("Error al cargar historial de turnos:", error);
    }
  };

  const handleStartShift = async () => {
    if (!selectedRegister || !startAmount) {
      showWarning("Por favor selecciona una caja e ingresa el monto inicial");
      return;
    }
    
    const amount = parseFloat(startAmount);
    if (isNaN(amount) || amount < 0) {
      showWarning("Por favor ingresa un monto válido");
      return;
    }
    
    setIsLoading(true);
    try {
      const newShift = await cashService.startShift(selectedRegister, amount, notes);
      setCurrentShift(newShift);
      setTransactions([]);
      setShowStartDialog(false);
      showSuccess("Turno iniciado correctamente");
      setStartAmount("");
      setNotes("");
    } catch (error) {
      console.error("Error al iniciar turno:", error);
      showError("Error al iniciar el turno");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndShift = async () => {
    if (!currentShift || !endAmount) {
      showWarning("Por favor ingresa el monto final de caja");
      return;
    }
    
    const amount = parseFloat(endAmount);
    if (isNaN(amount) || amount < 0) {
      showWarning("Por favor ingresa un monto válido");
      return;
    }
    
    setIsLoading(true);
    try {
      await cashService.endShift(currentShift.id, amount, notes);
      setCurrentShift(null);
      setTransactions([]);
      setShowEndDialog(false);
      showSuccess("Turno cerrado correctamente");
      setEndAmount("");
      setNotes("");
      loadShiftHistory();
    } catch (error) {
      console.error("Error al cerrar turno:", error);
      showError("Error al cerrar el turno");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddTransaction = async () => {
    if (!currentShift) {
      showWarning("No hay un turno activo");
      return;
    }
    
    if (!transactionAmount || !transactionDescription) {
      showWarning("Por favor completa todos los campos obligatorios");
      return;
    }
    
    const amount = parseFloat(transactionAmount);
    if (isNaN(amount)) {
      showWarning("Por favor ingresa un monto válido");
      return;
    }
    
    // Para gastos, retiros y devoluciones, el monto debe ser negativo
    let adjustedAmount = amount;
    if (transactionType === "expense" || transactionType === "withdrawal" || transactionType === "return") {
      adjustedAmount = -Math.abs(amount);
    }
    
    setIsLoading(true);
    try {
      const newTransaction = await cashService.addShiftTransaction(
        currentShift.id,
        transactionType,
        adjustedAmount,
        transactionPaymentMethod,
        transactionDescription,
        transactionReference
      );
      
      setTransactions(prev => [...prev, newTransaction]);
      setShowAddTransaction(false);
      showSuccess("Transacción registrada correctamente");
      
      // Limpiar formulario
      setTransactionType("sale");
      setTransactionAmount("");
      setTransactionPaymentMethod("efectivo");
      setTransactionDescription("");
      setTransactionReference("");
    } catch (error) {
      console.error("Error al añadir transacción:", error);
      showError("Error al registrar la transacción");
    } finally {
      setIsLoading(false);
    }
  };

  // Calcular saldo actual de caja si hay turno activo
  const calculateCurrentBalance = () => {
    if (!currentShift) return 0;
    
    const startAmount = currentShift.startAmount || 0;
    const transactionsSum = transactions.reduce((sum, t) => sum + t.amount, 0);
    
    return startAmount + transactionsSum;
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
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  };

  const getStatusBadge = (status: CashierShift["status"]) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500">Activo</Badge>;
      case "closed":
        return <Badge className="bg-blue-500">Cerrado</Badge>;
      case "pending_approval":
        return <Badge className="bg-yellow-500">Pendiente</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Control de Caja</h1>
        {!currentShift ? (
          <Button onClick={() => setShowStartDialog(true)}>
            <Clock className="mr-2 h-4 w-4" /> Iniciar Turno
          </Button>
        ) : (
          <Button variant="destructive" onClick={() => setShowEndDialog(true)}>
            <Clock className="mr-2 h-4 w-4" /> Cerrar Turno
          </Button>
        )}
      </div>

      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="actual">Caja Actual</TabsTrigger>
          <TabsTrigger value="pendiente">Pendientes</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        {/* Caja Actual */}
        <TabsContent value="actual" className="space-y-4">
          {currentShift ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Turno Activo</CardTitle>
                    <CardDescription>
                      Iniciado: {formatDate(currentShift.startTime)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Cajero:</span>
                        <span className="font-medium">{currentShift.userName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Caja:</span>
                        <span className="font-medium">
                          {registers.find(r => r.id === currentShift.registerId)?.name || "Desconocida"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Monto Inicial:</span>
                        <span className="font-medium">{formatCurrency(currentShift.startAmount)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-bold">
                        <span>Saldo Actual:</span>
                        <span className={currentShift ? "text-green-600" : ""}>
                          {formatCurrency(calculateCurrentBalance())}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="col-span-2">
                  <CardHeader className="pb-2 flex flex-row justify-between items-center">
                    <div>
                      <CardTitle className="text-lg">Transacciones</CardTitle>
                      <CardDescription>
                        Operaciones del turno actual
                      </CardDescription>
                    </div>
                    <Button variant="outline" onClick={() => setShowAddTransaction(true)}>
                      <Plus className="mr-2 h-4 w-4" /> Registrar
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[300px] pr-4">
                      {transactions.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No hay transacciones registradas
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {transactions.map((transaction) => (
                            <div 
                              key={transaction.id} 
                              className="flex justify-between items-center border-b pb-2"
                            >
                              <div>
                                <p className="font-medium">{transaction.description}</p>
                                <div className="text-sm text-muted-foreground">
                                  {formatDate(transaction.timestamp)} • {transaction.paymentMethod}
                                </div>
                              </div>
                              <span className={
                                transaction.amount > 0 
                                  ? "text-green-600 font-medium" 
                                  : "text-red-600 font-medium"
                              }>
                                {formatCurrency(transaction.amount)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No hay un turno activo</h3>
              <p className="text-muted-foreground mb-4">
                Inicia un nuevo turno para comenzar a operar la caja
              </p>
              <Button onClick={() => setShowStartDialog(true)}>
                <Clock className="mr-2 h-4 w-4" /> Iniciar Turno
              </Button>
            </div>
          )}
        </TabsContent>

        {/* Pendientes */}
        <TabsContent value="pendiente" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Turnos Pendientes de Aprobación</CardTitle>
              <CardDescription>
                Turnos cerrados que requieren aprobación del supervisor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {shiftHistory.filter(shift => shift.status === "pending_approval").length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay turnos pendientes de aprobación
                </div>
              ) : (
                <div className="space-y-4">
                  {shiftHistory
                    .filter(shift => shift.status === "pending_approval")
                    .map((shift) => (
                      <div key={shift.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-center mb-2">
                          <div>
                            <h3 className="font-medium">{shift.userName}</h3>
                            <p className="text-sm text-muted-foreground">
                              {formatDate(shift.endTime || shift.startTime)}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {shift.discrepancy && Math.abs(shift.discrepancy) > 0 && (
                              <Badge className={
                                shift.discrepancy > 0 ? "bg-green-500" : "bg-red-500"
                              }>
                                {shift.discrepancy > 0 ? "Sobrante" : "Faltante"}: {formatCurrency(Math.abs(shift.discrepancy))}
                              </Badge>
                            )}
                            {getStatusBadge(shift.status)}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Caja:</span>
                            <span>{registers.find(r => r.id === shift.registerId)?.name || "Desconocida"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Monto Inicial:</span>
                            <span>{formatCurrency(shift.startAmount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Monto Esperado:</span>
                            <span>{formatCurrency(shift.expectedEndAmount || 0)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Monto Final:</span>
                            <span>{formatCurrency(shift.endAmount || 0)}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex justify-end space-x-2">
                          <Button size="sm" variant="outline">Ver Detalle</Button>
                          <Button size="sm" variant="default">Aprobar</Button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Historial */}
        <TabsContent value="historial" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <CardTitle>Historial de Turnos</CardTitle>
                  <CardDescription>
                    Registro histórico de aperturas y cierres de caja
                  </CardDescription>
                </div>
                <div className="flex flex-wrap gap-2">
                  <div className="flex w-full md:w-auto">
                    <Button variant="outline" size="icon" className="rounded-r-none">
                      <CalendarDays className="h-4 w-4" />
                    </Button>
                    <Input placeholder="Fecha inicio" className="rounded-none w-full md:w-auto" />
                    <Input placeholder="Fecha fin" className="rounded-l-none w-full md:w-auto" />
                  </div>
                  <div className="flex w-full md:w-auto">
                    <Input placeholder="Buscar..." className="w-full md:w-auto" />
                    <Button variant="outline" size="icon" className="ml-1">
                      <Search className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="grid grid-cols-6 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-2">Cajero / Fecha</div>
                  <div className="text-center">Caja</div>
                  <div className="text-center">Inicial</div>
                  <div className="text-center">Final</div>
                  <div className="text-right">Estado</div>
                </div>
                <div className="divide-y">
                  {shiftHistory.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                      No hay registros de turnos
                    </div>
                  ) : (
                    shiftHistory.map((shift) => (
                      <div key={shift.id} className="grid grid-cols-6 items-center p-3 text-sm">
                        <div className="col-span-2">
                          <div className="font-medium">{shift.userName}</div>
                          <div className="text-xs text-muted-foreground">
                            {formatDate(shift.startTime)}
                          </div>
                        </div>
                        <div className="text-center">
                          {registers.find(r => r.id === shift.registerId)?.name || "-"}
                        </div>
                        <div className="text-center">
                          {formatCurrency(shift.startAmount)}
                        </div>
                        <div className="text-center">
                          {shift.endAmount ? formatCurrency(shift.endAmount) : "-"}
                        </div>
                        <div className="text-right">
                          {getStatusBadge(shift.status)}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Diálogo para Iniciar Turno */}
      <Dialog open={showStartDialog} onOpenChange={setShowStartDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Iniciar Nuevo Turno</DialogTitle>
            <DialogDescription>
              Completa los datos para iniciar un nuevo turno de caja
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="register">Selecciona la Caja</Label>
              <select
                id="register"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={selectedRegister}
                onChange={(e) => setSelectedRegister(e.target.value)}
                disabled={isLoading}
              >
                <option value="">Selecciona una caja...</option>
                {registers.map((register) => (
                  <option key={register.id} value={register.id}>
                    {register.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startAmount">Monto Inicial (S/)</Label>
              <Input
                id="startAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={startAmount}
                onChange={(e) => setStartAmount(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Input
                id="notes"
                placeholder="Notas sobre el inicio del turno"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStartDialog(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleStartShift} disabled={isLoading}>
              {isLoading ? "Procesando..." : "Iniciar Turno"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Cerrar Turno */}
      <Dialog open={showEndDialog} onOpenChange={setShowEndDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cerrar Turno</DialogTitle>
            <DialogDescription>
              Completa la información para cerrar el turno actual
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="p-3 bg-muted/50 rounded-md mb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Caja:</span>
                  <span>{registers.find(r => r.id === currentShift?.registerId)?.name || "Desconocida"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monto Inicial:</span>
                  <span>{formatCurrency(currentShift?.startAmount || 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Monto Esperado:</span>
                  <span className="font-medium">{formatCurrency(calculateCurrentBalance())}</span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="endAmount">Monto Final Real (S/)</Label>
              <Input
                id="endAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={endAmount}
                onChange={(e) => setEndAmount(e.target.value)}
                disabled={isLoading}
              />
              {endAmount && !isNaN(parseFloat(endAmount)) && currentShift && (
                <div className="mt-1">
                  <span className={
                    parseFloat(endAmount) === calculateCurrentBalance()
                      ? "text-green-600 text-sm"
                      : parseFloat(endAmount) > calculateCurrentBalance()
                        ? "text-blue-600 text-sm"
                        : "text-red-600 text-sm"
                  }>
                    {parseFloat(endAmount) === calculateCurrentBalance()
                      ? "✓ El monto coincide con lo esperado"
                      : parseFloat(endAmount) > calculateCurrentBalance()
                        ? `Sobrante: ${formatCurrency(parseFloat(endAmount) - calculateCurrentBalance())}`
                        : `Faltante: ${formatCurrency(calculateCurrentBalance() - parseFloat(endAmount))}`
                    }
                  </span>
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Input
                id="notes"
                placeholder="Notas sobre el cierre del turno"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEndDialog(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleEndShift} disabled={isLoading}>
              {isLoading ? "Procesando..." : "Cerrar Turno"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo para Añadir Transacción */}
      <Dialog open={showAddTransaction} onOpenChange={setShowAddTransaction}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Transacción</DialogTitle>
            <DialogDescription>
              Añade una nueva transacción al turno actual
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="transactionType">Tipo de Transacción</Label>
              <select
                id="transactionType"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={transactionType}
                onChange={(e) => setTransactionType(e.target.value as ShiftTransaction["type"])}
                disabled={isLoading}
              >
                <option value="sale">Venta</option>
                <option value="expense">Gasto</option>
                <option value="return">Devolución</option>
                <option value="deposit">Depósito</option>
                <option value="withdrawal">Retiro</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionAmount">Monto (S/)</Label>
              <Input
                id="transactionAmount"
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                value={transactionAmount}
                onChange={(e) => setTransactionAmount(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionPaymentMethod">Método de Pago</Label>
              <select
                id="transactionPaymentMethod"
                className="w-full rounded-md border border-input bg-background px-3 py-2"
                value={transactionPaymentMethod}
                onChange={(e) => setTransactionPaymentMethod(e.target.value as ShiftTransaction["paymentMethod"])}
                disabled={isLoading}
              >
                <option value="efectivo">Efectivo</option>
                <option value="yape">Yape</option>
                <option value="plin">Plin</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionDescription">Descripción</Label>
              <Input
                id="transactionDescription"
                placeholder="Descripción de la transacción"
                value={transactionDescription}
                onChange={(e) => setTransactionDescription(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="transactionReference">Referencia (opcional)</Label>
              <Input
                id="transactionReference"
                placeholder="Número de referencia"
                value={transactionReference}
                onChange={(e) => setTransactionReference(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddTransaction(false)} disabled={isLoading}>
              Cancelar
            </Button>
            <Button onClick={handleAddTransaction} disabled={isLoading}>
              {isLoading ? "Procesando..." : "Registrar Transacción"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CashRegisterPage;