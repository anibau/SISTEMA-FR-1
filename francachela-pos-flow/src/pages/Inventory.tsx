
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
  Package,
  AlertTriangle,
  BarChart3,
  Download,
  Upload,
  ScanLine,
  Filter
} from "lucide-react";

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  minStock: number;
  barcode?: string;
  supplier: string;
  lastUpdated: Date;
  status: 'active' | 'inactive' | 'discontinued';
}

const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Cerveza Pilsen 650ml",
    category: "Cerveza",
    price: 4.50,
    cost: 3.20,
    stock: 48,
    minStock: 20,
    barcode: "7751234567890",
    supplier: "Backus",
    lastUpdated: new Date(),
    status: 'active'
  },
  {
    id: "2",
    name: "Pisco Queirolo 750ml",
    category: "Pisco",
    price: 28.90,
    cost: 22.50,
    stock: 12,
    minStock: 15,
    barcode: "7751234567891",
    supplier: "Santiago Queirolo",
    lastUpdated: new Date(),
    status: 'active'
  },
  {
    id: "3",
    name: "Vodka Absolut 750ml",
    category: "Vodka",
    price: 65.00,
    cost: 48.00,
    stock: 8,
    minStock: 10,
    barcode: "7751234567892",
    supplier: "Pernod Ricard",
    lastUpdated: new Date(),
    status: 'active'
  },
  {
    id: "4",
    name: "Ron Cartavio 750ml",
    category: "Ron",
    price: 45.50,
    cost: 35.20,
    stock: 15,
    minStock: 8,
    barcode: "7751234567893",
    supplier: "Cartavio",
    lastUpdated: new Date(),
    status: 'active'
  },
  {
    id: "5",
    name: "Cerveza Corona 355ml",
    category: "Cerveza",
    price: 6.50,
    cost: 4.80,
    stock: 0,
    minStock: 24,
    barcode: "7751234567895",
    supplier: "AB InBev",
    lastUpdated: new Date(),
    status: 'active'
  }
];

const Inventory = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [showLowStock, setShowLowStock] = useState(false);

  const categories = ["Todos", "Cerveza", "Pisco", "Vodka", "Ron", "Whisky", "Vino"];

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.barcode?.includes(searchTerm) ||
                         product.supplier.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "Todos" || product.category === selectedCategory;
    
    const matchesStock = !showLowStock || product.stock <= product.minStock;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  // Estadísticas del inventario
  const totalProducts = products.length;
  const totalValue = products.reduce((sum, product) => sum + (product.stock * product.cost), 0);
  const lowStockProducts = products.filter(p => p.stock <= p.minStock).length;
  const outOfStockProducts = products.filter(p => p.stock === 0).length;

  const getStockStatus = (product: Product) => {
    if (product.stock === 0) return { status: 'out', color: 'destructive', text: 'Agotado' };
    if (product.stock <= product.minStock) return { status: 'low', color: 'destructive', text: 'Stock Bajo' };
    return { status: 'good', color: 'default', text: 'Disponible' };
  };

  const getMargin = (product: Product) => {
    return ((product.price - product.cost) / product.price * 100).toFixed(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Inventario</h1>
          <p className="text-muted-foreground">
            Gestión completa de productos, stock y precios
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 md:mt-0">
          <Button variant="outline" className="touch-target">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
          <Button variant="outline" className="touch-target">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>
          <Button className="pos-button">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>
      </div>

      {/* Estadísticas del inventario */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalProducts}</div>
            <p className="text-xs text-muted-foreground">productos registrados</p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">S/. {totalValue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">en inventario</p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Stock Bajo</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{lowStockProducts}</div>
            <p className="text-xs text-muted-foreground">productos por reponer</p>
          </CardContent>
        </Card>

        <Card className="pos-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Agotados</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{outOfStockProducts}</div>
            <p className="text-xs text-muted-foreground">sin stock</p>
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
                placeholder="Buscar por nombre, código de barras o proveedor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pos-button !p-3"
              />
            </div>
            <Button variant="outline" className="touch-target">
              <ScanLine className="h-4 w-4 mr-2" />
              Escáner
            </Button>
            <Button 
              variant={showLowStock ? "default" : "outline"} 
              onClick={() => setShowLowStock(!showLowStock)}
              className="touch-target"
            >
              <Filter className="h-4 w-4 mr-2" />
              Solo Stock Bajo
            </Button>
          </div>
          
          {/* Categorías */}
          <div className="flex gap-2 mt-4 overflow-x-auto">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(category)}
                className="whitespace-nowrap touch-target"
              >
                {category}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabla de productos */}
      <Card className="pos-card">
        <CardHeader>
          <CardTitle>
            Productos ({filteredProducts.length})
          </CardTitle>
          <CardDescription>
            Lista completa de productos en inventario
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {filteredProducts.map((product) => {
                const stockStatus = getStockStatus(product);
                const margin = getMargin(product);
                
                return (
                  <div
                    key={product.id}
                    className="border rounded-xl p-4 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                      {/* Información del producto */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {product.category} • {product.supplier}
                            </p>
                            {product.barcode && (
                              <p className="text-xs text-muted-foreground">
                                Código: {product.barcode}
                              </p>
                            )}
                          </div>
                          <Badge variant={stockStatus.color as any}>
                            {stockStatus.text}
                          </Badge>
                        </div>
                        
                        {/* Métricas en fila */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Stock:</span>
                            <div className="font-semibold">
                              {product.stock} / {product.minStock} min
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Precio:</span>
                            <div className="font-semibold text-primary">
                              S/. {product.price.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Costo:</span>
                            <div className="font-semibold">
                              S/. {product.cost.toFixed(2)}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Margen:</span>
                            <div className="font-semibold text-green-600">
                              {margin}%
                            </div>
                          </div>
                        </div>
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

                    {/* Barra de progreso de stock */}
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-muted-foreground mb-1">
                        <span>Stock actual vs mínimo</span>
                        <span>{((product.stock / Math.max(product.minStock * 2, product.stock)) * 100).toFixed(0)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all ${
                            product.stock === 0 
                              ? 'bg-red-500' 
                              : product.stock <= product.minStock 
                                ? 'bg-orange-500' 
                                : 'bg-green-500'
                          }`}
                          style={{
                            width: `${Math.min(100, (product.stock / Math.max(product.minStock * 2, product.stock)) * 100)}%`
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
                  <p className="text-muted-foreground">
                    Intenta con otros términos de búsqueda o ajusta los filtros
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Productos que necesitan reposición */}
      {lowStockProducts > 0 && (
        <Card className="pos-card border-orange-200">
          <CardHeader>
            <CardTitle className="text-orange-600 flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Productos por Reponer ({lowStockProducts})
            </CardTitle>
            <CardDescription>
              Productos que están por debajo del stock mínimo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {products
                .filter(p => p.stock <= p.minStock)
                .map((product) => (
                  <div key={product.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                    <div>
                      <span className="font-semibold">{product.name}</span>
                      <span className="text-sm text-muted-foreground ml-2">
                        Stock: {product.stock} / Mínimo: {product.minStock}
                      </span>
                    </div>
                    <Button size="sm" className="touch-target">
                      Reponer
                    </Button>
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Inventory;
