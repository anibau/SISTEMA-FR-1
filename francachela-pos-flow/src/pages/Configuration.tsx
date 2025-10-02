import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { configService } from "@/services";
import { mockSystemConfig } from "@/services/mock-data";
import { SystemConfig, GeneralConfig, PaymentConfig, PointsConfig, NotificationConfig, SecurityConfig } from "@/types/system.types";
import {
  Settings,
  Building,
  CreditCard,
  Award,
  Bell,
  ShieldCheck,
  Save,
  Mail,
  Phone,
  Globe,
  FileImage,
  Receipt,
  DollarSign,
  AlertTriangle,
  Lock,
  User,
  Clock,
  HistoryIcon,
  Cloud
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { showSuccess, showError, showWarning } from "@/lib/toast";

const ConfigPage = () => {
  const { user } = useAuth();
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("general");
  
  // Estados para cada tipo de configuración
  const [generalConfig, setGeneralConfig] = useState<GeneralConfig | null>(null);
  const [paymentsConfig, setPaymentsConfig] = useState<PaymentConfig | null>(null);
  const [pointsConfig, setPointsConfig] = useState<PointsConfig | null>(null);
  const [notificationsConfig, setNotificationsConfig] = useState<NotificationConfig | null>(null);
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig | null>(null);
  
  // Estado para cambios pendientes
  const [hasChanges, setHasChanges] = useState<{
    general: boolean;
    payments: boolean;
    points: boolean;
    notifications: boolean;
    security: boolean;
  }>({
    general: false,
    payments: false,
    points: false,
    notifications: false,
    security: false
  });
  
  // Cargar configuración inicial
  useEffect(() => {
    const loadConfig = async () => {
      setIsLoading(true);
      try {
        const configData = await configService.getSystemConfig();
        setConfig(configData);
        
        // Inicializar estados separados para cada sección
        setGeneralConfig(configData.general);
        setPaymentsConfig(configData.payments);
        setPointsConfig(configData.points);
        setNotificationsConfig(configData.notifications);
        setSecurityConfig(configData.security);
      } catch (error) {
        console.error("Error al cargar configuración:", error);
        showError("Error al cargar la configuración del sistema");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadConfig();
  }, []);
  
  // Manejar cambios en la configuración general
  const handleGeneralChange = (key: keyof GeneralConfig, value: string | undefined) => {
    if (!generalConfig) return;
    
    setGeneralConfig({ ...generalConfig, [key]: value });
    setHasChanges({ ...hasChanges, general: true });
  };
  
  // Manejar cambios en la configuración de pagos
  const handlePaymentsChange = (
    key: keyof PaymentConfig, 
    value: string | string[] | boolean
  ) => {
    if (!paymentsConfig) return;
    
    setPaymentsConfig({ ...paymentsConfig, [key]: value });
    setHasChanges({ ...hasChanges, payments: true });
  };
  
  // Manejar cambios en la configuración de puntos
  const handlePointsChange = (key: keyof PointsConfig, value: number | boolean) => {
    if (!pointsConfig) return;
    
    setPointsConfig({ ...pointsConfig, [key]: value });
    setHasChanges({ ...hasChanges, points: true });
  };
  
  // Manejar cambios en la configuración de notificaciones
  const handleNotificationsChange = (
    key: keyof NotificationConfig, 
    value: number | boolean | string[]
  ) => {
    if (!notificationsConfig) return;
    
    setNotificationsConfig({ ...notificationsConfig, [key]: value });
    setHasChanges({ ...hasChanges, notifications: true });
  };
  
  // Manejar cambios en la configuración de seguridad
  const handleSecurityChange = (key: keyof SecurityConfig, value: boolean | number) => {
    if (!securityConfig) return;
    
    setSecurityConfig({ ...securityConfig, [key]: value });
    setHasChanges({ ...hasChanges, security: true });
  };
  
  // Guardar cambios en la configuración general
  const saveGeneralConfig = async () => {
    if (!generalConfig) return;
    
    setIsLoading(true);
    try {
      const updated = await configService.updateGeneralConfig(generalConfig);
      setGeneralConfig(updated);
      setConfig(prev => prev ? { ...prev, general: updated } : null);
      setHasChanges({ ...hasChanges, general: false });
      showSuccess("Configuración general actualizada");
    } catch (error) {
      console.error("Error al guardar configuración general:", error);
      showError("Error al guardar la configuración general");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Guardar cambios en la configuración de pagos
  const savePaymentsConfig = async () => {
    if (!paymentsConfig) return;
    
    setIsLoading(true);
    try {
      const updated = await configService.updatePaymentConfig(paymentsConfig);
      setPaymentsConfig(updated);
      setConfig(prev => prev ? { ...prev, payments: updated } : null);
      setHasChanges({ ...hasChanges, payments: false });
      showSuccess("Configuración de pagos actualizada");
    } catch (error) {
      console.error("Error al guardar configuración de pagos:", error);
      showError("Error al guardar la configuración de pagos");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Guardar cambios en la configuración de puntos
  const savePointsConfig = async () => {
    if (!pointsConfig) return;
    
    setIsLoading(true);
    try {
      // Use the points from mockSystemConfig directly since there's no updatePointsConfig method
      const updated = pointsConfig;
      mockSystemConfig.points = { ...pointsConfig };
      setPointsConfig(updated);
      setConfig(prev => prev ? { ...prev, points: updated } : null);
      setHasChanges({ ...hasChanges, points: false });
      showSuccess("Configuración de puntos actualizada");
    } catch (error) {
      console.error("Error al guardar configuración de puntos:", error);
      showError("Error al guardar la configuración de puntos");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Guardar cambios en la configuración de notificaciones
  const saveNotificationsConfig = async () => {
    if (!notificationsConfig) return;
    
    setIsLoading(true);
    try {
      const updated = await configService.updateNotificationConfig(notificationsConfig);
      setNotificationsConfig(updated);
      setConfig(prev => prev ? { ...prev, notifications: updated } : null);
      setHasChanges({ ...hasChanges, notifications: false });
      showSuccess("Configuración de notificaciones actualizada");
    } catch (error) {
      console.error("Error al guardar configuración de notificaciones:", error);
      showError("Error al guardar la configuración de notificaciones");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Guardar cambios en la configuración de seguridad
  const saveSecurityConfig = async () => {
    if (!securityConfig) return;
    
    setIsLoading(true);
    try {
      const updated = await configService.updateSecurityConfig(securityConfig);
      setSecurityConfig(updated);
      setConfig(prev => prev ? { ...prev, security: updated } : null);
      setHasChanges({ ...hasChanges, security: false });
      showSuccess("Configuración de seguridad actualizada");
    } catch (error) {
      console.error("Error al guardar configuración de seguridad:", error);
      showError("Error al guardar la configuración de seguridad");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verificar si el usuario tiene permisos para configurar
  const canEdit = user?.role === 'admin';
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Configuración del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading && !config ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5 mb-6">
                <TabsTrigger value="general" className="flex items-center gap-2">
                  <Building className="h-4 w-4" /> General
                </TabsTrigger>
                <TabsTrigger value="payments" className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" /> Pagos
                </TabsTrigger>
                <TabsTrigger value="points" className="flex items-center gap-2">
                  <Award className="h-4 w-4" /> Puntos
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center gap-2">
                  <Bell className="h-4 w-4" /> Notificaciones
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" /> Seguridad
                </TabsTrigger>
              </TabsList>
              
              {/* Configuración General */}
              <TabsContent value="general" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Información del Negocio</h3>
                  {hasChanges.general && canEdit && (
                    <Button onClick={saveGeneralConfig} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Nombre Comercial</Label>
                    <Input 
                      id="businessName"
                      value={generalConfig?.businessName || ""}
                      onChange={(e) => handleGeneralChange("businessName", e.target.value)}
                      disabled={!canEdit || isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="legalName">Razón Social</Label>
                    <Input 
                      id="legalName"
                      value={generalConfig?.legalName || ""}
                      onChange={(e) => handleGeneralChange("legalName", e.target.value)}
                      disabled={!canEdit || isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="taxId">RUC</Label>
                    <Input 
                      id="taxId"
                      value={generalConfig?.taxId || ""}
                      onChange={(e) => handleGeneralChange("taxId", e.target.value)}
                      disabled={!canEdit || isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moneda</Label>
                    <select
                      id="currency"
                      className="w-full rounded-md border border-input bg-background px-3 py-2"
                      value={generalConfig?.currency || "PEN"}
                      onChange={(e) => handleGeneralChange("currency", e.target.value)}
                      disabled={!canEdit || isLoading}
                    >
                      <option value="PEN">Sol Peruano (PEN)</option>
                      <option value="USD">Dólar Americano (USD)</option>
                    </select>
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <div className="space-y-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input 
                    id="address"
                    value={generalConfig?.address || ""}
                    onChange={(e) => handleGeneralChange("address", e.target.value)}
                    disabled={!canEdit || isLoading}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-1">
                      <Phone className="h-4 w-4" /> Teléfono
                    </Label>
                    <Input 
                      id="phone"
                      value={generalConfig?.phone || ""}
                      onChange={(e) => handleGeneralChange("phone", e.target.value)}
                      disabled={!canEdit || isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-1">
                      <Mail className="h-4 w-4" /> Email
                    </Label>
                    <Input 
                      id="email"
                      type="email"
                      value={generalConfig?.email || ""}
                      onChange={(e) => handleGeneralChange("email", e.target.value)}
                      disabled={!canEdit || isLoading}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website" className="flex items-center gap-1">
                      <Globe className="h-4 w-4" /> Sitio Web
                    </Label>
                    <Input 
                      id="website"
                      value={generalConfig?.website || ""}
                      onChange={(e) => handleGeneralChange("website", e.target.value)}
                      disabled={!canEdit || isLoading}
                    />
                  </div>
                </div>
                
                <div className="space-y-2 mt-4">
                  <Label htmlFor="logo" className="flex items-center gap-1">
                    <FileImage className="h-4 w-4" /> Logo
                  </Label>
                  <div className="flex items-center gap-4">
                    {generalConfig?.logo && (
                      <div className="h-16 w-16 border rounded-md flex items-center justify-center overflow-hidden">
                        <img 
                          src={generalConfig.logo} 
                          alt="Logo" 
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    )}
                    <Input 
                      id="logo"
                      type="file"
                      accept="image/*"
                      disabled={!canEdit || isLoading}
                    />
                  </div>
                </div>
                
                <Separator className="my-4" />
                
                <h3 className="text-lg font-medium">Personalización de Recibos</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="receiptHeader" className="flex items-center gap-1">
                      <Receipt className="h-4 w-4" /> Encabezado de Recibo
                    </Label>
                    <Textarea 
                      id="receiptHeader"
                      value={generalConfig?.receiptHeader || ""}
                      onChange={(e) => handleGeneralChange("receiptHeader", e.target.value)}
                      disabled={!canEdit || isLoading}
                      placeholder="Ej: FRANCACHELA - TU TIENDA DE LICORES"
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="receiptFooter" className="flex items-center gap-1">
                      <Receipt className="h-4 w-4" /> Pie de Recibo
                    </Label>
                    <Textarea 
                      id="receiptFooter"
                      value={generalConfig?.receiptFooter || ""}
                      onChange={(e) => handleGeneralChange("receiptFooter", e.target.value)}
                      disabled={!canEdit || isLoading}
                      placeholder="Ej: ¡Gracias por tu compra!"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </TabsContent>
              
              {/* Configuración de Pagos */}
              <TabsContent value="payments" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Métodos de Pago</h3>
                  {hasChanges.payments && canEdit && (
                    <Button onClick={savePaymentsConfig} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Selecciona los métodos de pago habilitados:</p>
                    
                    <div className="space-y-2">
                      {["efectivo", "yape", "plin", "transferencia", "tarjeta"].map((method) => (
                        <div key={method} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`method-${method}`}
                            checked={paymentsConfig?.enabledMethods.includes(method)}
                            onChange={(e) => {
                              if (!paymentsConfig) return;
                              const methods = [...paymentsConfig.enabledMethods];
                              if (e.target.checked) {
                                if (!methods.includes(method)) {
                                  methods.push(method);
                                }
                              } else {
                                const index = methods.indexOf(method);
                                if (index !== -1) {
                                  methods.splice(index, 1);
                                }
                              }
                              handlePaymentsChange("enabledMethods", methods);
                            }}
                            disabled={!canEdit || isLoading}
                          />
                          <Label htmlFor={`method-${method}`} className="capitalize">
                            {method}
                          </Label>
                        </div>
                      ))}
                    </div>
                    
                    <div className="pt-4">
                      <Label htmlFor="defaultMethod">Método de pago predeterminado</Label>
                      <select
                        id="defaultMethod"
                        className="w-full rounded-md border border-input bg-background px-3 py-2 mt-2"
                        value={paymentsConfig?.defaultMethod || "efectivo"}
                        onChange={(e) => handlePaymentsChange("defaultMethod", e.target.value)}
                        disabled={!canEdit || isLoading}
                      >
                        {paymentsConfig?.enabledMethods.map((method) => (
                          <option key={method} value={method} className="capitalize">{method}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Opciones de pago:</p>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="allowPartialPayments" className="flex-1">
                        Permitir pagos parciales
                      </Label>
                      <Switch
                        id="allowPartialPayments"
                        checked={paymentsConfig?.allowPartialPayments || false}
                        onCheckedChange={(checked) => handlePaymentsChange("allowPartialPayments", checked)}
                        disabled={!canEdit || isLoading}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requireReceiptForExpenses" className="flex-1">
                        Exigir comprobante para gastos
                      </Label>
                      <Switch
                        id="requireReceiptForExpenses"
                        checked={paymentsConfig?.requireReceiptForExpenses || false}
                        onCheckedChange={(checked) => handlePaymentsChange("requireReceiptForExpenses", checked)}
                        disabled={!canEdit || isLoading}
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="allowNegativeInventory" className="flex items-center">
                          Permitir inventario negativo
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Permite vender productos aunque no haya stock disponible
                        </p>
                      </div>
                      <Switch
                        id="allowNegativeInventory"
                        checked={paymentsConfig?.allowNegativeInventory || false}
                        onCheckedChange={(checked) => handlePaymentsChange("allowNegativeInventory", checked)}
                        disabled={!canEdit || isLoading}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Configuración de Puntos */}
              <TabsContent value="points" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Sistema de Puntos</h3>
                  {hasChanges.points && canEdit && (
                    <Button onClick={savePointsConfig} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                    </Button>
                  )}
                </div>
                
                <div className="flex items-center justify-between pb-4">
                  <div className="flex-1">
                    <Label htmlFor="pointsEnabled">Estado del sistema de puntos</Label>
                    <p className="text-sm text-muted-foreground">Activa o desactiva el sistema de puntos</p>
                  </div>
                  <Switch
                    id="pointsEnabled"
                    checked={pointsConfig?.enabled || false}
                    onCheckedChange={(checked) => handlePointsChange("enabled", checked)}
                    disabled={!canEdit || isLoading}
                  />
                </div>
                
                <Separator />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-medium">Configuración Básica</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pointsPerPurchaseAmount" className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" /> Monto por punto
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="pointsPerPurchaseAmount"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={pointsConfig?.pointsPerPurchaseAmount || ""}
                          onChange={(e) => handlePointsChange("pointsPerPurchaseAmount", parseFloat(e.target.value))}
                          disabled={!canEdit || isLoading}
                        />
                        <span className="text-sm text-muted-foreground">PEN = 1 punto</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pointValueInCurrency" className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" /> Valor del punto
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="pointValueInCurrency"
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={pointsConfig?.pointValueInCurrency || ""}
                          onChange={(e) => handlePointsChange("pointValueInCurrency", parseFloat(e.target.value))}
                          disabled={!canEdit || isLoading}
                        />
                        <span className="text-sm text-muted-foreground">PEN por punto</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="minimumRedeemPoints" className="flex items-center gap-1">
                        <Award className="h-4 w-4" /> Mínimo para canje
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="minimumRedeemPoints"
                          type="number"
                          min="1"
                          value={pointsConfig?.minimumRedeemPoints || ""}
                          onChange={(e) => handlePointsChange("minimumRedeemPoints", parseInt(e.target.value))}
                          disabled={!canEdit || isLoading}
                        />
                        <span className="text-sm text-muted-foreground">puntos</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pointsExpirationDays" className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> Expiración
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="pointsExpirationDays"
                          type="number"
                          min="1"
                          value={pointsConfig?.pointsExpirationDays || ""}
                          onChange={(e) => handlePointsChange("pointsExpirationDays", parseInt(e.target.value))}
                          disabled={!canEdit || isLoading}
                        />
                        <span className="text-sm text-muted-foreground">días</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Bonificaciones</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="welcomePoints" className="flex items-center gap-1">
                        <User className="h-4 w-4" /> Puntos de bienvenida
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="welcomePoints"
                          type="number"
                          min="0"
                          value={pointsConfig?.welcomePoints || ""}
                          onChange={(e) => handlePointsChange("welcomePoints", parseInt(e.target.value))}
                          disabled={!canEdit || isLoading}
                        />
                        <span className="text-sm text-muted-foreground">puntos</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Puntos otorgados por registrarse
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="birthdayPoints" className="flex items-center gap-1">
                        <Award className="h-4 w-4" /> Puntos por cumpleaños
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="birthdayPoints"
                          type="number"
                          min="0"
                          value={pointsConfig?.birthdayPoints || ""}
                          onChange={(e) => handlePointsChange("birthdayPoints", parseInt(e.target.value))}
                          disabled={!canEdit || isLoading}
                        />
                        <span className="text-sm text-muted-foreground">puntos</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="referralPoints" className="flex items-center gap-1">
                        <User className="h-4 w-4" /> Puntos por referido
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="referralPoints"
                          type="number"
                          min="0"
                          value={pointsConfig?.referralPoints || ""}
                          onChange={(e) => handlePointsChange("referralPoints", parseInt(e.target.value))}
                          disabled={!canEdit || isLoading}
                        />
                        <span className="text-sm text-muted-foreground">puntos</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Puntos otorgados por traer un nuevo cliente
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Configuración de Notificaciones */}
              <TabsContent value="notifications" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Configuración de Notificaciones</h3>
                  {hasChanges.notifications && canEdit && (
                    <Button onClick={saveNotificationsConfig} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-medium">Canales de Notificación</h4>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableEmailNotifications" className="flex-1">
                        Habilitar notificaciones por email
                      </Label>
                      <Switch
                        id="enableEmailNotifications"
                        checked={notificationsConfig?.enableEmailNotifications || false}
                        onCheckedChange={(checked) => handleNotificationsChange("enableEmailNotifications", checked)}
                        disabled={!canEdit || isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientEmails">Emails de destinatarios</Label>
                      <Textarea 
                        id="recipientEmails"
                        value={(notificationsConfig?.recipientEmails || []).join("\n")}
                        onChange={(e) => handleNotificationsChange(
                          "recipientEmails", 
                          e.target.value.split("\n").filter(email => email.trim() !== "")
                        )}
                        disabled={!canEdit || isLoading || !notificationsConfig?.enableEmailNotifications}
                        placeholder="Ingresar un email por línea"
                        className="min-h-[100px]"
                      />
                    </div>
                    
                    <Separator />
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="enableSmsNotifications" className="flex-1">
                        Habilitar notificaciones por SMS
                      </Label>
                      <Switch
                        id="enableSmsNotifications"
                        checked={notificationsConfig?.enableSmsNotifications || false}
                        onCheckedChange={(checked) => handleNotificationsChange("enableSmsNotifications", checked)}
                        disabled={!canEdit || isLoading}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="recipientPhones">Números de teléfono</Label>
                      <Textarea 
                        id="recipientPhones"
                        value={(notificationsConfig?.recipientPhones || []).join("\n")}
                        onChange={(e) => handleNotificationsChange(
                          "recipientPhones", 
                          e.target.value.split("\n").filter(phone => phone.trim() !== "")
                        )}
                        disabled={!canEdit || isLoading || !notificationsConfig?.enableSmsNotifications}
                        placeholder="Ingresar un número por línea"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Eventos de Notificación</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="lowStockThreshold" className="flex items-center gap-1">
                        <AlertTriangle className="h-4 w-4" /> Umbral de stock bajo
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="lowStockThreshold"
                          type="number"
                          min="0"
                          value={notificationsConfig?.lowStockThreshold || ""}
                          onChange={(e) => handleNotificationsChange("lowStockThreshold", parseInt(e.target.value))}
                          disabled={!canEdit || isLoading}
                        />
                        <span className="text-sm text-muted-foreground">unidades</span>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifyOnLowStock" className="flex-1">
                          Notificar stock bajo
                        </Label>
                        <Switch
                          id="notifyOnLowStock"
                          checked={notificationsConfig?.notifyOnLowStock || false}
                          onCheckedChange={(checked) => handleNotificationsChange("notifyOnLowStock", checked)}
                          disabled={!canEdit || isLoading}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifyOnSale" className="flex-1">
                          Notificar ventas
                        </Label>
                        <Switch
                          id="notifyOnSale"
                          checked={notificationsConfig?.notifyOnSale || false}
                          onCheckedChange={(checked) => handleNotificationsChange("notifyOnSale", checked)}
                          disabled={!canEdit || isLoading}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifyOnExpense" className="flex-1">
                          Notificar gastos
                        </Label>
                        <Switch
                          id="notifyOnExpense"
                          checked={notificationsConfig?.notifyOnExpense || false}
                          onCheckedChange={(checked) => handleNotificationsChange("notifyOnExpense", checked)}
                          disabled={!canEdit || isLoading}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <Label htmlFor="notifyOnCashDiscrepancy" className="flex-1">
                          Notificar discrepancias de caja
                        </Label>
                        <Switch
                          id="notifyOnCashDiscrepancy"
                          checked={notificationsConfig?.notifyOnCashDiscrepancy || false}
                          onCheckedChange={(checked) => handleNotificationsChange("notifyOnCashDiscrepancy", checked)}
                          disabled={!canEdit || isLoading}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              {/* Configuración de Seguridad */}
              <TabsContent value="security" className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium">Configuración de Seguridad</h3>
                  {hasChanges.security && canEdit && (
                    <Button onClick={saveSecurityConfig} disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" /> Guardar Cambios
                    </Button>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="font-medium">Permisos de Operación</h4>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requirePasswordForVoids" className="flex-1">
                        Requerir contraseña para anulaciones
                      </Label>
                      <Switch
                        id="requirePasswordForVoids"
                        checked={securityConfig?.requirePasswordForVoids || false}
                        onCheckedChange={(checked) => handleSecurityChange("requirePasswordForVoids", checked)}
                        disabled={!canEdit || isLoading}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requirePasswordForReturns" className="flex-1">
                        Requerir contraseña para devoluciones
                      </Label>
                      <Switch
                        id="requirePasswordForReturns"
                        checked={securityConfig?.requirePasswordForReturns || false}
                        onCheckedChange={(checked) => handleSecurityChange("requirePasswordForReturns", checked)}
                        disabled={!canEdit || isLoading}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Label htmlFor="requirePasswordForDiscounts" className="flex-1">
                        Requerir contraseña para descuentos
                      </Label>
                      <Switch
                        id="requirePasswordForDiscounts"
                        checked={securityConfig?.requirePasswordForDiscounts || false}
                        onCheckedChange={(checked) => handleSecurityChange("requirePasswordForDiscounts", checked)}
                        disabled={!canEdit || isLoading}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium">Sesión y Acceso</h4>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sessionTimeoutMinutes" className="flex items-center gap-1">
                        <Clock className="h-4 w-4" /> Tiempo de sesión
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="sessionTimeoutMinutes"
                          type="number"
                          min="1"
                          value={securityConfig?.sessionTimeoutMinutes || ""}
                          onChange={(e) => handleSecurityChange("sessionTimeoutMinutes", parseInt(e.target.value))}
                          disabled={!canEdit || isLoading}
                        />
                        <span className="text-sm text-muted-foreground">minutos</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Tiempo de inactividad antes de cerrar sesión automáticamente
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="auditTrailDays" className="flex items-center gap-1">
                        <HistoryIcon className="h-4 w-4" /> Retención de auditoría
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input 
                          id="auditTrailDays"
                          type="number"
                          min="1"
                          value={securityConfig?.auditTrailDays || ""}
                          onChange={(e) => handleSecurityChange("auditTrailDays", parseInt(e.target.value))}
                          disabled={!canEdit || isLoading}
                        />
                        <span className="text-sm text-muted-foreground">días</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-4">
                      <Label htmlFor="allowMultipleLogins" className="flex-1">
                        Permitir múltiples inicios de sesión
                      </Label>
                      <Switch
                        id="allowMultipleLogins"
                        checked={securityConfig?.allowMultipleLogins || false}
                        onCheckedChange={(checked) => handleSecurityChange("allowMultipleLogins", checked)}
                        disabled={!canEdit || isLoading}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label htmlFor="allowRemoteAccess">Permitir acceso remoto</Label>
                        <p className="text-xs text-muted-foreground">
                          Permite el acceso desde fuera de la red local
                        </p>
                      </div>
                      <Switch
                        id="allowRemoteAccess"
                        checked={securityConfig?.allowRemoteAccess || false}
                        onCheckedChange={(checked) => handleSecurityChange("allowRemoteAccess", checked)}
                        disabled={!canEdit || isLoading}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
      
      {!canEdit && (
        <div className="mt-4 p-4 bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-md flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          <p>Solo los administradores pueden modificar la configuración del sistema.</p>
        </div>
      )}
    </div>
  );
};

export default ConfigPage;