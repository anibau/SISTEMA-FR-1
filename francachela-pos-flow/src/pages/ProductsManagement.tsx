import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { 
  useProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct, 
  useUpdateStock, 
  useCategories
} from "@/hooks/useProducts";

import { 
  useFeaturedProducts,
  useInventoryStats,
  useProductCategories,
  useProductBrands,
  useProductSuppliers,
  useBulkUpdatePrices,
  useLowStockProductsAdvanced,
  useAdjustStock
} from "@/hooks/useProductsAdvanced";

import { Product, SearchFilters, BulkPriceUpdate, StockAdjustment } from "@/types/pos.types";

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
  ArrowDownUp,
  Filter,
  XCircle,
  Save,
  RefreshCw,
  Tag,
  DollarSign,
  Check,
  Star,
  StarOff,
  ShoppingCart,
  PackageCheck,
  PackageX,
  Truck,
  BadgePercent,
  BarChart2,
  PenTool,
  PlusSquare,
  MinusSquare,
  History
} from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { showSuccess, showError, showWarning } from "@/lib/toast";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const ProductsManagementPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState("productos");
  
  // Estados para la gestión de productos
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [brandFilter, setBrandFilter] = useState<string>("none");
  const [supplierFilter, setSupplierFilter] = useState<string>("none");
  const [stockFilter, setStockFilter] = useState<string>("all"); // "all", "inStock", "lowStock", "outOfStock"
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Estados para modales
  const [showProductModal, setShowProductModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  
  // Estados para formularios
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: "",
    price: 0,
    cost: 0,
    stock: 0,
    minStock: 5,
    category: "all",
    brand: "none",
    supplier: "none",
    description: "",
    barcode: "",
    sku: "",
    isActive: true,
    isFeatured: false
  });
  
  const [stockForm, setStockForm] = useState<StockAdjustment>({
    productId: "",
    quantity: 0,
    reason: "purchase",
    notes: ""
  });
  
  const [bulkPriceForm, setBulkPriceForm] = useState<BulkPriceUpdate>({
    productIds: [],
    updateType: "percentage",
    value: 0
  });
  
  // Construir filtros basados en el estado
  const buildFilters = (): SearchFilters => {
    const filters: SearchFilters = {};
    
    if (categoryFilter && categoryFilter !== "all") filters.category = categoryFilter;
    if (brandFilter && brandFilter !== "none") filters.brand = brandFilter;
    if (supplierFilter && supplierFilter !== "none") filters.supplier = supplierFilter;
    
    if (stockFilter === "inStock") filters.inStock = true;
    else if (stockFilter === "outOfStock") filters.inStock = false;
    
    return filters;
  };
  
  // Consultas React Query
  const { data: productsData, isLoading: productsLoading } = useProducts({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    sortBy,
    sortOrder
  });
  
  const { data: categories } = useCategories();
  const { data: productCategories } = useProductCategories();
  const { data: brands } = useProductBrands();
  const { data: suppliers } = useProductSuppliers();
  const { data: stats } = useInventoryStats();
  const { data: lowStockProducts } = useLowStockProductsAdvanced();
  
  // Mutaciones
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();
  const updateStockMutation = useAdjustStock();
  const bulkUpdatePricesMutation = useBulkUpdatePrices();
  
  // Productos filtrados
  const filteredProducts = productsData?.data || [];
  
  // Manejar envío de formulario de producto
  const handleProductSubmit = () => {
    if (!productForm.name || !productForm.price) {
      showWarning("Por favor completa los campos obligatorios");
      return;
    }
    
    if (selectedProduct) {
      // Actualizar producto existente
      updateProduct.mutate({ 
        id: selectedProduct.id, 
        updates: productForm as Partial<Product>
      }, {
        onSuccess: () => {
          setShowProductModal(false);
          setSelectedProduct(null);
          resetProductForm();
        }
      });
    } else {
      // Crear nuevo producto
      createProduct.mutate(productForm as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>, {
        onSuccess: () => {
          setShowProductModal(false);
          resetProductForm();
        }
      });
    }
  };
  
  // Manejar envío de formulario de stock
  const handleStockSubmit = () => {
    if (!stockForm.productId || stockForm.quantity === 0) {
      showWarning("Por favor completa los campos obligatorios");
      return;
    }
    
    updateStockMutation.mutate(stockForm, {
      onSuccess: () => {
        setShowStockModal(false);
        setStockForm({
          productId: "",
          quantity: 0,
          reason: "purchase",
          notes: ""
        });
      }
    });
  };
  
  // Manejar envío de actualización masiva de precios
  const handleBulkPriceUpdate = () => {
    if (bulkPriceForm.productIds.length === 0 || bulkPriceForm.value <= 0) {
      showWarning("Por favor selecciona productos y establece un valor válido");
      return;
    }
    
    bulkUpdatePricesMutation.mutate(bulkPriceForm, {
      onSuccess: () => {
        setShowBulkPriceModal(false);
        setSelectedProducts([]);
        setBulkPriceForm({
          productIds: [],
          updateType: "percentage",
          value: 0
        });
      }
    });
  };
  
  // Resetear formulario de producto
  const resetProductForm = () => {
    setProductForm({
      name: "",
      price: 0,
      cost: 0,
      stock: 0,
      minStock: 5,
      category: "none",
      brand: "none",
      supplier: "none",
      description: "",
      barcode: "",
      sku: "",
      isActive: true,
      isFeatured: false
    });
  };
  
  // Editar producto
  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setProductForm({
      name: product.name,
      price: product.price,
      cost: product.cost || 0,
      stock: product.stock,
      minStock: product.minStock || 5,
      category: product.category,
      brand: product.brand || "",
      supplier: product.supplier || "",
      description: product.description || "",
      barcode: product.barcode || "",
      sku: product.sku || "",
      isActive: product.isActive !== false,
      isFeatured: product.isFeatured || false
    });
    setShowProductModal(true);
  };
  
  // Eliminar producto
  const handleDeleteConfirm = () => {
    if (selectedProduct) {
      deleteProduct.mutate(selectedProduct.id, {
        onSuccess: () => {
          setShowDeleteModal(false);
          setSelectedProduct(null);
        }
      });
    }
  };
  
  // Ajustar stock
  const handleAdjustStock = (product: Product) => {
    setSelectedProduct(product);
    setStockForm({
      productId: product.id,
      quantity: 0,
      reason: "purchase",
      notes: ""
    });
    setShowStockModal(true);
  };
  
  // Manejar selección de producto para actualización masiva
  const handleProductSelection = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
    }
  };
  
  // Inicializar formulario de actualización masiva
  const handleOpenBulkPriceModal = () => {
    setBulkPriceForm({
      ...bulkPriceForm,
      productIds: selectedProducts
    });
    setShowBulkPriceModal(true);
  };
  
  // Formatear moneda
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(amount);
  };
  
  // Formatear fecha
  const formatDate = (date?: Date) => {
    if (!date) return '-';
    return new Intl.DateTimeFormat('es-PE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  };
  
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Productos</h1>
        
        <div className="flex space-x-2">
          {isAdmin && (
            <Button onClick={() => handleOpenBulkPriceModal()} disabled={selectedProducts.length === 0}>
              <Tag className="mr-2 h-4 w-4" /> Actualizar Precios ({selectedProducts.length})
            </Button>
          )}
          
          {isAdmin && (
            <Button onClick={() => {
              resetProductForm();
              setSelectedProduct(null);
              setShowProductModal(true);
            }}>
              <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
            </Button>
          )}
        </div>
      </div>
      
      {/* Pestañas */}
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="stock">Control de Stock</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>
        
        {/* Pestaña de Productos */}
        <TabsContent value="productos">
          <div className="grid grid-cols-1 gap-6">
            {/* Filtros y búsqueda */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center">
                  <Filter className="mr-2 h-5 w-5" /> Filtros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Buscar productos..."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas las categorías</SelectItem>
                      {categories?.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Select value={stockFilter} onValueChange={setStockFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Stock" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="inStock">Con stock</SelectItem>
                      <SelectItem value="lowStock">Stock bajo</SelectItem>
                      <SelectItem value="outOfStock">Sin stock</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Ordenar por" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="name">Nombre</SelectItem>
                      <SelectItem value="price">Precio</SelectItem>
                      <SelectItem value="stock">Stock</SelectItem>
                      <SelectItem value="category">Categoría</SelectItem>
                      <SelectItem value="updatedAt">Última actualización</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Button 
                    variant="outline" 
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                    className="flex items-center"
                  >
                    <ArrowDownUp className="mr-2 h-4 w-4" />
                    {sortOrder === "asc" ? "Ascendente" : "Descendente"}
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            {/* Tabla de productos */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center">
                    <Package className="mr-2 h-5 w-5" /> 
                    Productos ({filteredProducts.length})
                  </div>
                  <div className="flex items-center space-x-2 text-sm">
                    <Select value={`${itemsPerPage}`} onValueChange={(value) => setItemsPerPage(Number(value))}>
                      <SelectTrigger className="h-8 w-[80px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-muted-foreground">por página</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <div className="text-center py-10">
                    <Package className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                    <h3 className="text-lg font-medium mb-1">No se encontraron productos</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Prueba con otros filtros o crea un nuevo producto
                    </p>
                    {isAdmin && (
                      <Button onClick={() => {
                        resetProductForm();
                        setSelectedProduct(null);
                        setShowProductModal(true);
                      }}>
                        <Plus className="mr-2 h-4 w-4" /> Nuevo Producto
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          {isAdmin && (
                            <TableHead className="w-[50px]">
                              <Checkbox 
                                checked={selectedProducts.length === filteredProducts.length && filteredProducts.length > 0}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedProducts(filteredProducts.map(p => p.id));
                                  } else {
                                    setSelectedProducts([]);
                                  }
                                }}
                              />
                            </TableHead>
                          )}
                          <TableHead>Nombre</TableHead>
                          <TableHead>SKU/Código</TableHead>
                          <TableHead>Categoría</TableHead>
                          <TableHead className="text-right">Precio</TableHead>
                          <TableHead className="text-right">Stock</TableHead>
                          <TableHead className="text-center">Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredProducts.map((product) => (
                          <TableRow key={product.id}>
                            {isAdmin && (
                              <TableCell>
                                <Checkbox 
                                  checked={selectedProducts.includes(product.id)}
                                  onCheckedChange={(checked) => 
                                    handleProductSelection(product.id, checked as boolean)
                                  }
                                />
                              </TableCell>
                            )}
                            <TableCell>
                              <div className="font-medium">{product.name}</div>
                              {product.isFeatured && (
                                <Badge variant="outline" className="text-yellow-500 border-yellow-500 mt-1">
                                  <Star className="h-3 w-3 mr-1" /> Destacado
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-muted-foreground">
                                {product.sku || product.barcode || "-"}
                              </div>
                            </TableCell>
                            <TableCell>{product.category}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(product.price)}
                            </TableCell>
                            <TableCell className="text-right">
                              <span className={`font-medium ${
                                product.stock === 0 ? "text-red-500" : 
                                (product.minStock && product.stock <= product.minStock) 
                                  ? "text-amber-500" : ""
                              }`}>
                                {product.stock}
                              </span>
                              {product.minStock && (
                                <div className="text-xs text-muted-foreground">
                                  Mín: {product.minStock}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-center">
                              {product.isActive !== false ? (
                                <Badge className="bg-green-500">Activo</Badge>
                              ) : (
                                <Badge variant="outline" className="text-red-500 border-red-500">
                                  Inactivo
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end space-x-1">
                                <Button 
                                  size="icon" 
                                  variant="ghost"
                                  onClick={() => handleAdjustStock(product)}
                                >
                                  <PackageCheck className="h-4 w-4" />
                                </Button>
                                {isAdmin && (
                                  <>
                                    <Button 
                                      size="icon" 
                                      variant="ghost"
                                      onClick={() => handleEditProduct(product)}
                                    >
                                      <Edit3 className="h-4 w-4" />
                                    </Button>
                                    <Button 
                                      size="icon" 
                                      variant="ghost"
                                      onClick={() => {
                                        setSelectedProduct(product);
                                        setShowDeleteModal(true);
                                      }}
                                      className="text-red-500"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex items-center justify-between border-t p-4">
                <div className="text-sm text-muted-foreground">
                  Mostrando {filteredProducts.length} de {productsData?.meta?.total || 0} productos
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm">
                    Página {currentPage} de {productsData?.meta?.totalPages || 1}
                  </span>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => setCurrentPage(currentPage + 1)}
                    disabled={!productsData?.meta?.hasNext}
                  >
                    Siguiente
                  </Button>
                </div>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>
        
        {/* Pestaña de Control de Stock */}
        <TabsContent value="stock">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-amber-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-amber-500" /> Stock Bajo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{lowStockProducts?.length || 0}</div>
                <p className="text-sm text-muted-foreground mt-2">
                  Productos con stock por debajo del mínimo recomendado
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-red-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <PackageX className="mr-2 h-5 w-5 text-red-500" /> Sin Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {stats?.outOfStockCount || 0}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Productos agotados que requieren reposición
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-green-50">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <ShoppingCart className="mr-2 h-5 w-5 text-green-500" /> Valor de Inventario
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(stats?.totalValue || 0)}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Valor total de productos en stock a precio de costo
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle>Productos con Stock Bajo</CardTitle>
              <CardDescription>
                Productos que requieren reposición o ajuste de inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              {lowStockProducts && lowStockProducts.length > 0 ? (
                <ScrollArea className="h-[400px]">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Producto</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead className="text-right">Actual</TableHead>
                        <TableHead className="text-right">Mínimo</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {lowStockProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell>
                            <div className="font-medium">{product.name}</div>
                            <div className="text-xs text-muted-foreground">
                              SKU: {product.sku || "-"}
                            </div>
                          </TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-right">
                            <span className={product.stock === 0 ? "text-red-500 font-bold" : "text-amber-500 font-bold"}>
                              {product.stock}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            {product.minStock || 5}
                          </TableCell>
                          <TableCell className="text-right">
                            <Button 
                              size="sm" 
                              onClick={() => handleAdjustStock(product)}
                            >
                              Ajustar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </ScrollArea>
              ) : (
                <div className="text-center py-10">
                  <Check className="mx-auto h-12 w-12 text-green-500 opacity-50 mb-3" />
                  <h3 className="text-lg font-medium mb-1">¡No hay productos con stock bajo!</h3>
                  <p className="text-muted-foreground text-sm">
                    Todos los productos tienen niveles adecuados de inventario
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Pestaña de Categorías */}
        <TabsContent value="categorias">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Categorías de Productos</CardTitle>
                <CardDescription>
                  Listado de todas las categorías disponibles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4">
                    {productCategories?.map((category) => (
                      <div key={category.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{category.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {category.description || "Sin descripción"}
                          </div>
                        </div>
                        {category.isActive ? (
                          <Badge>Activa</Badge>
                        ) : (
                          <Badge variant="outline">Inactiva</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Marcas</CardTitle>
                <CardDescription>
                  Listado de marcas de productos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[220px]">
                  <div className="space-y-4">
                    {brands?.map((brand) => (
                      <div key={brand.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{brand.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {brand.description || "Sin descripción"}
                          </div>
                        </div>
                        {brand.isActive ? (
                          <Badge>Activa</Badge>
                        ) : (
                          <Badge variant="outline">Inactiva</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
              <CardHeader className="border-t mt-4">
                <CardTitle>Proveedores</CardTitle>
                <CardDescription>
                  Listado de proveedores de productos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[220px]">
                  <div className="space-y-4">
                    {suppliers?.map((supplier) => (
                      <div key={supplier.id} className="flex items-center justify-between p-3 border rounded-md">
                        <div>
                          <div className="font-medium">{supplier.name}</div>
                          <div className="text-sm text-muted-foreground">
                            Contacto: {supplier.contactPerson || "No especificado"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {supplier.phone || supplier.email || "Sin contacto"}
                          </div>
                        </div>
                        {supplier.isActive ? (
                          <Badge>Activo</Badge>
                        ) : (
                          <Badge variant="outline">Inactivo</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Pestaña de Estadísticas */}
        <TabsContent value="estadisticas">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Package className="mr-2 h-5 w-5" /> Total Productos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalProducts || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Tag className="mr-2 h-5 w-5" /> Categorías
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalCategories || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BadgePercent className="mr-2 h-5 w-5" /> Marcas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalBrands || 0}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Truck className="mr-2 h-5 w-5" /> Proveedores
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats?.totalSuppliers || 0}</div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Productos más vendidos</CardTitle>
                <CardDescription>
                  Los productos con mayor volumen de ventas
                </CardDescription>
              </CardHeader>
              <CardContent>
                {stats?.mostSoldProducts && stats.mostSoldProducts.length > 0 ? (
                  <ScrollArea className="h-[300px]">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Producto</TableHead>
                          <TableHead className="text-right">Cantidad vendida</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {stats.mostSoldProducts.map((product) => (
                          <TableRow key={product.id}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-right">{product.quantity}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </ScrollArea>
                ) : (
                  <div className="text-center py-10">
                    <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-3" />
                    <p className="text-muted-foreground text-sm">
                      No hay datos suficientes de ventas
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Información financiera</CardTitle>
                <CardDescription>
                  Resumen financiero del inventario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <DollarSign className="h-5 w-5 mr-2 text-green-500" />
                      <span>Valor total del inventario</span>
                    </div>
                    <span className="font-bold">{formatCurrency(stats?.totalValue || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                      <span>Costo promedio por producto</span>
                    </div>
                    <span className="font-bold">{formatCurrency(stats?.averageCost || 0)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <PackageX className="h-5 w-5 mr-2 text-red-500" />
                      <span>Productos sin stock</span>
                    </div>
                    <span className="font-bold">{stats?.outOfStockCount || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-md">
                    <div className="flex items-center">
                      <AlertTriangle className="h-5 w-5 mr-2 text-amber-500" />
                      <span>Productos con stock bajo</span>
                    </div>
                    <span className="font-bold">{stats?.lowStockCount || 0}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Modal para crear/editar producto */}
      <Dialog open={showProductModal} onOpenChange={setShowProductModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedProduct ? "Editar Producto" : "Nuevo Producto"}
            </DialogTitle>
            <DialogDescription>
              {selectedProduct 
                ? "Modifica los detalles del producto existente" 
                : "Completa los detalles para crear un nuevo producto"
              }
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input 
                  id="name" 
                  value={productForm.name || ""} 
                  onChange={(e) => setProductForm({...productForm, name: e.target.value})}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Precio de Venta *</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      className="pl-8"
                      value={productForm.price || 0} 
                      onChange={(e) => setProductForm({...productForm, price: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cost">Costo</Label>
                  <div className="relative">
                    <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      id="cost" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      className="pl-8"
                      value={productForm.cost || 0} 
                      onChange={(e) => setProductForm({...productForm, cost: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Actual *</Label>
                  <Input 
                    id="stock" 
                    type="number" 
                    min="0"
                    value={productForm.stock || 0} 
                    onChange={(e) => setProductForm({...productForm, stock: parseInt(e.target.value)})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="minStock">Stock Mínimo</Label>
                  <Input 
                    id="minStock" 
                    type="number" 
                    min="0"
                    value={productForm.minStock || 0} 
                    onChange={(e) => setProductForm({...productForm, minStock: parseInt(e.target.value)})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Categoría *</Label>
                <Select 
                  value={productForm.category || ""} 
                  onValueChange={(value) => setProductForm({...productForm, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories?.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="barcode">Código de Barras</Label>
                  <Input 
                    id="barcode" 
                    value={productForm.barcode || ""} 
                    onChange={(e) => setProductForm({...productForm, barcode: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU / Código</Label>
                  <Input 
                    id="sku" 
                    value={productForm.sku || ""} 
                    onChange={(e) => setProductForm({...productForm, sku: e.target.value})}
                  />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea 
                  id="description" 
                  rows={4}
                  value={productForm.description || ""} 
                  onChange={(e) => setProductForm({...productForm, description: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="brand">Marca</Label>
                <Select 
                  value={productForm.brand || ""} 
                  onValueChange={(value) => setProductForm({...productForm, brand: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una marca" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin marca</SelectItem>
                    {brands?.map((brand) => (
                      <SelectItem key={brand.id} value={brand.name}>
                        {brand.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="supplier">Proveedor</Label>
                <Select 
                  value={productForm.supplier || ""} 
                  onValueChange={(value) => setProductForm({...productForm, supplier: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un proveedor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin proveedor</SelectItem>
                    {suppliers?.map((supplier) => (
                      <SelectItem key={supplier.id} value={supplier.name}>
                        {supplier.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center space-x-2 pt-4">
                <Checkbox 
                  id="isActive"
                  checked={productForm.isActive !== false}
                  onCheckedChange={(checked) => 
                    setProductForm({...productForm, isActive: !!checked})
                  }
                />
                <Label htmlFor="isActive" className="cursor-pointer">Producto activo</Label>
              </div>
              
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox 
                  id="isFeatured"
                  checked={productForm.isFeatured === true}
                  onCheckedChange={(checked) => 
                    setProductForm({...productForm, isFeatured: !!checked})
                  }
                />
                <Label htmlFor="isFeatured" className="cursor-pointer">Producto destacado</Label>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowProductModal(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleProductSubmit}>
              {selectedProduct ? "Guardar Cambios" : "Crear Producto"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para confirmar eliminación */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que deseas eliminar el producto "{selectedProduct?.name}"? 
              Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteConfirm}
            >
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para ajustar stock */}
      <Dialog open={showStockModal} onOpenChange={setShowStockModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ajustar Stock</DialogTitle>
            <DialogDescription>
              Actualiza el stock de {selectedProduct?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Stock Actual</Label>
                <div className="text-2xl font-bold mt-1">{selectedProduct?.stock || 0}</div>
                {selectedProduct?.minStock && (
                  <div className="text-sm text-muted-foreground">
                    Mínimo: {selectedProduct.minStock}
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="quantity">Cantidad a ajustar</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setStockForm({...stockForm, quantity: stockForm.quantity - 1})}
                  >
                    <MinusSquare className="h-4 w-4" />
                  </Button>
                  <Input 
                    id="quantity" 
                    type="number"
                    value={stockForm.quantity} 
                    onChange={(e) => setStockForm({...stockForm, quantity: parseInt(e.target.value)})}
                    className="text-center"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => setStockForm({...stockForm, quantity: stockForm.quantity + 1})}
                  >
                    <PlusSquare className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {stockForm.quantity > 0 ? "Agregar" : "Reducir"} {Math.abs(stockForm.quantity)} unidades
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="reason">Motivo del ajuste</Label>
              <Select 
                value={stockForm.reason} 
                onValueChange={(value) => setStockForm({...stockForm, reason: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un motivo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="purchase">Compra de producto</SelectItem>
                  <SelectItem value="return">Devolución</SelectItem>
                  <SelectItem value="damaged">Producto dañado</SelectItem>
                  <SelectItem value="inventory">Ajuste de inventario</SelectItem>
                  <SelectItem value="transfer">Transferencia</SelectItem>
                  <SelectItem value="other">Otro motivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea 
                id="notes" 
                rows={3}
                value={stockForm.notes || ""} 
                onChange={(e) => setStockForm({...stockForm, notes: e.target.value})}
                placeholder="Añade detalles adicionales sobre este ajuste..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowStockModal(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleStockSubmit}>
              Confirmar Ajuste
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Modal para actualización masiva de precios */}
      <Dialog open={showBulkPriceModal} onOpenChange={setShowBulkPriceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Actualización Masiva de Precios</DialogTitle>
            <DialogDescription>
              Actualiza los precios de {selectedProducts.length} productos seleccionados
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="updateType">Tipo de actualización</Label>
              <RadioGroup 
                value={bulkPriceForm.updateType}
                onValueChange={(value) => setBulkPriceForm({
                  ...bulkPriceForm, 
                  updateType: value as "percentage" | "fixed"
                })}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="percentage" id="percentage" />
                  <Label htmlFor="percentage">Porcentaje (%)</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="fixed" id="fixed" />
                  <Label htmlFor="fixed">Monto Fijo (S/)</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="value">Valor a aplicar</Label>
              <div className="relative">
                {bulkPriceForm.updateType === "percentage" ? (
                  <span className="absolute right-3 top-2.5 text-muted-foreground">%</span>
                ) : (
                  <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                )}
                <Input 
                  id="value" 
                  type="number"
                  step="0.01" 
                  min="0"
                  className={bulkPriceForm.updateType === "percentage" ? "" : "pl-8"}
                  value={bulkPriceForm.value || 0} 
                  onChange={(e) => setBulkPriceForm({...bulkPriceForm, value: parseFloat(e.target.value)})}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {bulkPriceForm.updateType === "percentage" 
                  ? "Los precios se incrementarán o reducirán en este porcentaje" 
                  : "Se establecerá este precio para todos los productos seleccionados"
                }
              </p>
            </div>
            
            <div className="rounded-md border p-4 bg-muted/30">
              <p className="font-medium">Productos seleccionados: {selectedProducts.length}</p>
              <ScrollArea className="h-[100px] mt-2">
                <ul className="text-sm space-y-1">
                  {filteredProducts
                    .filter(p => selectedProducts.includes(p.id))
                    .map(p => (
                      <li key={p.id} className="text-muted-foreground">• {p.name}</li>
                    ))
                  }
                </ul>
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowBulkPriceModal(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleBulkPriceUpdate}>
              Actualizar Precios
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductsManagementPage;