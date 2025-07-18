
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
  Gift,
  Percent,
  Calendar,
  Star,
  Package,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'combo' | 'birthday';
  value: number;
  minAmount?: number;
  buyQuantity?: number;
  getQuantity?: number;
  applicableProducts: string[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  usageCount: number;
  maxUsage?: number;
  conditions?: string;
}

interface Combo {
  id: string;
  name: string;
  description: string;
  products: Array<{
    id: string;
    name: string;
    quantity: number;
    originalPrice: number;
  }>;
  comboPrice: number;
  originalPrice: number;
  discount: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  salesCount: number;
}

const samplePromotions: Promotion[] = [
  {
    id: "1",
    name: "3x2 en Cervezas",
    description: "Lleva 3 cervezas y paga solo 2",
    type: 'buy_x_get_y',
    value: 0,
    buyQuantity: 3,
    getQuantity: 2,
    applicableProducts: ["Cerveza"],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    isActive: true,
    usageCount: 45,
    maxUsage: 100
  },
  {
    id: "2",
    name: "20% OFF en Vinos",
    description: "Descuento del 20% en toda la línea de vinos",
    type: 'percentage',
    value: 20,
    applicableProducts: ["Vino"],
    startDate: new Date("2024-01-10"),
    endDate: new Date("2024-01-25"),
    isActive: true,
    usageCount: 23,
    conditions: "No acumulable con otras ofertas"
  },
  {
    id: "3",
    name: "Descuento Cumpleañero",
    description: "15% de descuento especial por cumpleaños",
    type: 'birthday',
    value: 15,
    applicableProducts: ["Todos"],
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-12-31"),
    isActive: true,
    usageCount: 8,
    conditions: "Válido el día del cumpleaños + 3 días"
  },
  {
    id: "4",
    name: "S/. 10 OFF",
    description: "S/. 10 de descuento en compras mayores a S/. 100",
    type: 'fixed_amount',
    value: 10,
    minAmount: 100,
    applicableProducts: ["Todos"],
    startDate: new Date("2024-01-05"),
    endDate: new Date("2024-01-20"),
    isActive: false,
    usageCount: 67,
    maxUsage: 50
  }
];

const sampleCombos: Combo[] = [
  {
    id: "1",
    name: "Combo Parrillero",
    description: "Cerveza Pilsen 6 pack + Ron Cartavio 750ml",
    products: [
      { id: "1", name: "Cerveza Pilsen 650ml", quantity: 6, originalPrice: 27.00 },
      { id: "4", name: "Ron Cartavio 750ml", quantity: 1, originalPrice: 45.50 }
    ],
    comboPrice: 65.00,
    originalPrice: 72.50,
    discount: 10.3,
    isActive: true,
    startDate: new Date("2024-01-01"),
    endDate: new Date("2024-01-31"),
    salesCount: 34
  },
  {
    id: "2",
    name: "Combo Premium",
    description: "Whisky J.Walker + Vodka Absolut",
    products: [
      { id: "5", name: "Whisky Johnnie Walker Red", quantity: 1, originalPrice: 89.90 },
      { id: "3", name: "Vodka Absolut 750ml", quantity: 1, originalPrice: 65.00 }
    ],
    comboPrice: 140.00,
    originalPrice: 154.90,
    discount: 9.6,
    isActive: true,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-02-15"),
    salesCount: 12
  }
];

const Promotions = () => {
  const [promotions, setPromotions] = useState<Promotion[]>(samplePromotions);
  const [combos, setCombos] = useState<Combo[]>(sampleCombos);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("Todos");
  const [selectedStatus, setSelectedStatus] = useState("Todos");

  const promotionTypes = ["Todos", "percentage", "fixed_amount", "buy_x_get_y", "combo", "birthday"];
  const statusOptions = ["Todos", "active", "inactive", "expired"];

  // Filtrar promociones
  const filteredPromotions = promotions.filter(promo => {
    const matchesSearch = promo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promo.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === "Todos" || promo.type === selectedType;
    
    const now = new Date();
    let matchesStatus = true;
    if (selectedStatus === "active") {
      matchesStatus = promo.isActive && promo.endDate >= now;
    } else if (selectedStatus === "inactive") {
      matchesStatus = !promo.isActive;
    } else if (selectedStatus === "expired") {
      matchesStatus = promo.endDate < now;
    }
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Estadísticas
  const activePromotions = promotions.filter(p => p.isActive && p.endDate >= new Date()).length;
  const totalUsage = promotions.reduce((sum, promo) => sum + promo.usageCount, 0);
  const activeCombos = combos.filter(c => c.isActive && c.endDate >= new Date()).length;
  const totalComboSales = combos.reduce((sum, combo) => sum + combo.salesCount, 0);

  const getPromotionTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage': return 'Porcentaje';
      case 'fixed_amount': return 'Monto Fijo';
      case 'buy_x_get_y': return 'Lleva X Paga Y';
      case 'combo': return 'Combo';
      case 'birthday': return 'Cumpleaños';
      default: return type;
    }
  };

  const getPromotionIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="h-4 w-4" />;
      case 'fixed_amount': return <Gift className="h-4 w-4" />;
      case 'buy_x_get_y': return <Package className="h-4 w-4" />;
      case 'combo': return <Star className="h-4 w-4" />;
      case 'birthday': return <Calendar className="h-4 w-4" />;
      default: return <Gift className="h-4 w-4" />;
    }
  };

  const isPromotionExpired = (endDate: Date) => {
    return endDate < new Date();
  };

  const isPromotionActive = (promotion: Promotion) => {
    const now = new Date();
    return promotion.isActive && promotion.startDate <= now && promotion.endDate >= now;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Promociones y Combos</h1>
          <p className="text-muted-foreground">
            Gestión de ofertas especiales, descuentos y combos
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button className="pos-button">
            <Plus className="h-4 w-4 mr-2" />
            Nueva Promoción
          </Button>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promociones Activas</CardTitle>
            <Gift className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activePromotions}</div>
            <p className="text-xs text-muted-foreground">vigentes</p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usos Totales</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalUsage}</div>
            <p className="text-xs text-muted-foreground">aplicaciones</p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Combos Activos</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{activeCombos}</div>
            <p className="text-xs text-muted-foreground">disponibles</p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas de Combos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalComboSales}</div>
            <p className="text-xs text-muted-foreground">unidades vendidas</p>
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
                placeholder="Buscar promociones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pos-button !p-3"
              />
            </div>
          </div>
          
          {/* Filtros */}
          <div className="flex flex-col md:flex-row gap-4 mt-4">
            <div className="flex gap-2 overflow-x-auto">
              <span className="text-sm font-medium py-2 whitespace-nowrap">Tipo:</span>
              {promotionTypes.map((type) => (
                <Button
                  key={type}
                  variant={selectedType === type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(type)}
                  className="whitespace-nowrap touch-target"
                >
                  {type === "Todos" ? type : getPromotionTypeLabel(type)}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs para diferentes vistas */}
      <Tabs defaultValue="promotions" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="promotions">Promociones</TabsTrigger>
          <TabsTrigger value="combos">Combos</TabsTrigger>
          <TabsTrigger value="analytics">Análisis</TabsTrigger>
        </TabsList>

        <TabsContent value="promotions" className="space-y-4">
          <Card className="pos-card">
            <CardHeader>
              <CardTitle>Lista de Promociones ({filteredPromotions.length})</CardTitle>
              <CardDescription>Gestiona descuentos y ofertas especiales</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {filteredPromotions.map((promotion) => {
                    const isActive = isPromotionActive(promotion);
                    const isExpired = isPromotionExpired(promotion.endDate);
                    
                    return (
                      <div
                        key={promotion.id}
                        className="border rounded-xl p-4 hover:shadow-md transition-all duration-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                          {/* Información de la promoción */}
                          <div className="flex-1 space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center space-x-2">
                                  {getPromotionIcon(promotion.type)}
                                  <h3 className="font-semibold text-lg">{promotion.name}</h3>
                                  {isActive && (
                                    <Badge className="bg-green-500 text-white">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Activa
                                    </Badge>
                                  )}
                                  {isExpired && (
                                    <Badge variant="destructive">
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Expirada
                                    </Badge>
                                  )}
                                  {!promotion.isActive && !isExpired && (
                                    <Badge variant="secondary">
                                      Inactiva
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {promotion.description}
                                </p>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-2">
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="h-3 w-3" />
                                    <span>
                                      {promotion.startDate.toLocaleDateString()} - {promotion.endDate.toLocaleDateString()}
                                    </span>
                                  </span>
                                  <span>Tipo: {getPromotionTypeLabel(promotion.type)}</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Detalles de la promoción */}
                            <div className="bg-muted rounded-lg p-3">
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Valor:</span>
                                  <div className="font-semibold">
                                    {promotion.type === 'percentage' && `${promotion.value}%`}
                                    {promotion.type === 'fixed_amount' && `S/. ${promotion.value}`}
                                    {promotion.type === 'buy_x_get_y' && `${promotion.buyQuantity}x${promotion.getQuantity}`}
                                    {promotion.type === 'birthday' && `${promotion.value}%`}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Usos:</span>
                                  <div className="font-semibold">
                                    {promotion.usageCount}
                                    {promotion.maxUsage && ` / ${promotion.maxUsage}`}
                                  </div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Productos:</span>
                                  <div className="font-semibold">
                                    {promotion.applicableProducts.join(', ')}
                                  </div>
                                </div>
                              </div>
                              
                              {promotion.conditions && (
                                <div className="mt-2 text-xs text-muted-foreground">
                                  <strong>Condiciones:</strong> {promotion.conditions}
                                </div>
                              )}
                              
                              {promotion.minAmount && (
                                <div className="mt-1 text-xs text-muted-foreground">
                                  <strong>Compra mínima:</strong> S/. {promotion.minAmount}
                                </div>
                              )}
                            </div>
                            
                            {/* Barra de progreso si tiene límite */}
                            {promotion.maxUsage && (
                              <div className="mt-3">
                                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                                  <span>Progreso de uso</span>
                                  <span>{((promotion.usageCount / promotion.maxUsage) * 100).toFixed(0)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className={`h-2 rounded-full transition-all ${
                                      promotion.usageCount >= promotion.maxUsage
                                        ? 'bg-red-500'
                                        : promotion.usageCount / promotion.maxUsage > 0.8
                                          ? 'bg-orange-500'
                                          : 'bg-green-500'
                                    }`}
                                    style={{
                                      width: `${Math.min(100, (promotion.usageCount / promotion.maxUsage) * 100)}%`
                                    }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>

                          {/* Acciones */}
                          <div className="flex items-center space-x-2">
                            <Button variant="outline" size="sm" className="touch-target">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="touch-target text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  
                  {filteredPromotions.length === 0 && (
                    <div className="text-center py-12">
                      <Gift className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold mb-2">No se encontraron promociones</h3>
                      <p className="text-muted-foreground">
                        Crea tu primera promoción para empezar a atraer clientes
                      </p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="combos" className="space-y-4">
          <Card className="pos-card">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Combos Disponibles ({combos.length})
              </CardTitle>
              <CardDescription>Paquetes especiales con descuentos atractivos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {combos.map((combo) => {
                  const isActive = combo.isActive && combo.endDate >= new Date();
                  
                  return (
                    <div
                      key={combo.id}
                      className="border rounded-xl p-4 hover:shadow-md transition-all duration-200"
                    >
                      <div className="space-y-3">
                        {/* Header del combo */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center space-x-2">
                              <Star className="h-5 w-5 text-yellow-500" />
                              <h3 className="font-semibold text-lg">{combo.name}</h3>
                              {isActive ? (
                                <Badge className="bg-green-500 text-white">Activo</Badge>
                              ) : (
                                <Badge variant="secondary">Inactivo</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">
                              {combo.description}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="touch-target">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" className="touch-target text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        {/* Productos del combo */}
                        <div className="bg-muted rounded-lg p-3">
                          <h4 className="font-medium text-sm mb-2">Productos incluidos:</h4>
                          <div className="space-y-1">
                            {combo.products.map((product, index) => (
                              <div key={index} className="flex justify-between text-sm">
                                <span>{product.quantity}x {product.name}</span>
                                <span>S/. {product.originalPrice.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Precios y ahorro */}
                        <div className="bg-primary/10 rounded-lg p-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <div className="text-sm text-muted-foreground">Precio individual:</div>
                              <div className="text-lg line-through text-muted-foreground">
                                S/. {combo.originalPrice.toFixed(2)}
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm text-muted-foreground">Precio combo:</div>
                              <div className="text-2xl font-bold text-primary">
                                S/. {combo.comboPrice.toFixed(2)}
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 text-center">
                            <Badge className="bg-green-500 text-white text-lg px-3 py-1">
                              ¡Ahorra {combo.discount.toFixed(1)}%!
                            </Badge>
                          </div>
                        </div>

                        {/* Estadísticas */}
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              Hasta {combo.endDate.toLocaleDateString()}
                            </span>
                          </span>
                          <span className="flex items-center space-x-1">
                            <TrendingUp className="h-3 w-3" />
                            <span>{combo.salesCount} vendidos</span>
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="mt-6 text-center">
                <Button className="pos-button">
                  <Plus className="h-4 w-4 mr-2" />
                  Crear Nuevo Combo
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Promociones más usadas */}
            <Card className="pos-card">
              <CardHeader>
                <CardTitle>Promociones Más Exitosas</CardTitle>
                <CardDescription>Por número de usos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {promotions
                    .sort((a, b) => b.usageCount - a.usageCount)
                    .slice(0, 5)
                    .map((promo, index) => (
                      <div key={promo.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="francachela-gradient text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{promo.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {getPromotionTypeLabel(promo.type)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">
                            {promo.usageCount}
                          </div>
                          <div className="text-sm text-muted-foreground">usos</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>

            {/* Combos más vendidos */}
            <Card className="pos-card">
              <CardHeader>
                <CardTitle>Combos Más Vendidos</CardTitle>
                <CardDescription>Por unidades vendidas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {combos
                    .sort((a, b) => b.salesCount - a.salesCount)
                    .map((combo, index) => (
                      <div key={combo.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="francachela-gradient text-white rounded-full w-8 h-8 flex items-center justify-center font-bold">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="font-semibold">{combo.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {combo.discount.toFixed(1)}% descuento
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-primary">
                            {combo.salesCount}
                          </div>
                          <div className="text-sm text-muted-foreground">vendidos</div>
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Promociones próximas a vencer */}
          <Card className="pos-card border-orange-200">
            <CardHeader>
              <CardTitle className="text-orange-600 flex items-center">
                <Clock className="h-5 w-5 mr-2" />
                Promociones por Vencer
              </CardTitle>
              <CardDescription>Promociones que vencen en los próximos 7 días</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {promotions
                  .filter(promo => {
                    const now = new Date();
                    const daysToExpire = Math.ceil((promo.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    return daysToExpire <= 7 && daysToExpire > 0;
                  })
                  .map((promo) => {
                    const now = new Date();
                    const daysToExpire = Math.ceil((promo.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                    
                    return (
                      <div key={promo.id} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                        <div>
                          <h4 className="font-semibold">{promo.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            Vence en {daysToExpire} día{daysToExpire !== 1 ? 's' : ''}
                          </p>
                        </div>
                        <div className="flex space-x-2">
                          <Button size="sm" className="touch-target">
                            Extender
                          </Button>
                          <Button variant="outline" size="sm" className="touch-target">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                
                {promotions.filter(promo => {
                  const now = new Date();
                  const daysToExpire = Math.ceil((promo.endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
                  return daysToExpire <= 7 && daysToExpire > 0;
                }).length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    No hay promociones próximas a vencer
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Promotions;
