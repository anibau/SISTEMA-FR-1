
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  User,
  Calculator,
  Printer,
  CreditCard,
  Banknote,
  Smartphone,
  ScanLine,
  Ticket,
  Save,
  X,
  Package
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Tipos de datos
interface Product {
  id: string;
  name: string;
  price: number;
  barcode?: string;
  stock: number;
  category: string;
  image?: string;
}

interface CartItem extends Product {
  quantity: number;
}

interface Ticket {
  id: string;
  items: CartItem[];
  customer?: string;
  total: number;
  status: 'active' | 'saved' | 'completed';
  createdAt: Date;
}

// Datos de ejemplo
const sampleProducts: Product[] = [
  {
    id: "1",
    name: "Cerveza Pilsen 650ml",
    price: 4.50,
    barcode: "7751234567890",
    stock: 48,
    category: "Cerveza",
    image: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Pisco Queirolo 750ml",
    price: 28.90,
    barcode: "7751234567891",
    stock: 12,
    category: "Pisco",
    image: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Vodka Absolut 750ml",
    price: 65.00,
    barcode: "7751234567892",
    stock: 8,
    category: "Vodka",
    image: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Ron Cartavio 750ml",
    price: 45.50,
    barcode: "7751234567893",
    stock: 15,
    category: "Ron",
    image: "/placeholder.svg"
  },
  {
    id: "5",
    name: "Whisky Johnnie Walker Red",
    price: 89.90,
    barcode: "7751234567894",
    stock: 6,
    category: "Whisky",
    image: "/placeholder.svg"
  },
  {
    id: "6",
    name: "Cerveza Corona 355ml",
    price: 6.50,
    barcode: "7751234567895",
    stock: 24,
    category: "Cerveza",
    image: "/placeholder.svg"
  }
];

const POS = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [activeTicketId, setActiveTicketId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const categories = ["Todos", "Cerveza", "Pisco", "Vodka", "Ron", "Whisky"];

  // Crear nuevo ticket
  const createNewTicket = () => {
    const newTicket: Ticket = {
      id: `T${Date.now()}`,
      items: [],
      total: 0,
      status: 'active',
      createdAt: new Date()
    };
    setTickets([...tickets, newTicket]);
    setActiveTicketId(newTicket.id);
  };

  // Obtener ticket activo
  const activeTicket = tickets.find(t => t.id === activeTicketId);

  // Crear primer ticket si no hay ninguno
  useEffect(() => {
    if (tickets.length === 0) {
      createNewTicket();
    }
  }, []);

  // Filtrar productos
  useEffect(() => {
    let filtered = sampleProducts;
    
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.barcode?.includes(searchTerm)
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory]);

  // Agregar producto al carrito
  const addToCart = (product: Product) => {
    if (!activeTicket) return;
    
    const existingItem = activeTicket.items.find(item => item.id === product.id);
    let updatedItems;
    
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        alert(`Stock insuficiente. Solo quedan ${product.stock} unidades.`);
        return;
      }
      updatedItems = activeTicket.items.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      if (product.stock === 0) {
        alert("Producto agotado");
        return;
      }
      updatedItems = [...activeTicket.items, { ...product, quantity: 1 }];
    }
    
    const newTotal = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTickets(tickets.map(ticket =>
      ticket.id === activeTicketId
        ? { ...ticket, items: updatedItems, total: newTotal }
        : ticket
    ));
  };

  // Remover producto del carrito
  const removeFromCart = (productId: string) => {
    if (!activeTicket) return;
    
    const updatedItems = activeTicket.items.filter(item => item.id !== productId);
    const newTotal = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTickets(tickets.map(ticket =>
      ticket.id === activeTicketId
        ? { ...ticket, items: updatedItems, total: newTotal }
        : ticket
    ));
  };

  // Actualizar cantidad
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (!activeTicket) return;
    
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    
    const product = sampleProducts.find(p => p.id === productId);
    if (product && newQuantity > product.stock) {
      alert(`Stock insuficiente. Solo quedan ${product.stock} unidades.`);
      return;
    }
    
    const updatedItems = activeTicket.items.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    const newTotal = updatedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    setTickets(tickets.map(ticket =>
      ticket.id === activeTicketId
        ? { ...ticket, items: updatedItems, total: newTotal }
        : ticket
    ));
  };

  // Eliminar ticket
  const deleteTicket = (ticketId: string) => {
    const updatedTickets = tickets.filter(t => t.id !== ticketId);
    setTickets(updatedTickets);
    
    if (ticketId === activeTicketId) {
      if (updatedTickets.length > 0) {
        setActiveTicketId(updatedTickets[0].id);
      } else {
        createNewTicket();
      }
    }
  };

  // Procesar venta
  const processSale = (paymentMethod: string) => {
    if (!activeTicket || activeTicket.items.length === 0) {
      alert("No hay productos en el carrito");
      return;
    }
    
    // Aquí iría la lógica de procesamiento de venta
    alert(`Venta procesada con ${paymentMethod}. Total: S/. ${activeTicket.total.toFixed(2)}`);
    
    // Limpiar ticket actual
    setTickets(tickets.map(ticket =>
      ticket.id === activeTicketId
        ? { ...ticket, items: [], total: 0, status: 'completed' }
        : ticket
    ));
    
    // Crear nuevo ticket
    createNewTicket();
  };

  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Panel de productos */}
      <div className="lg:col-span-2 space-y-4">
        {/* Búsqueda y filtros */}
        <Card className="pos-card">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar productos o escanear código de barras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pos-button !p-3"
                />
              </div>
              <Button variant="outline" className="touch-target">
                <ScanLine className="h-4 w-4 mr-2" />
                Escáner
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

        {/* Lista de productos */}
        <Card className="pos-card">
          <CardHeader>
            <CardTitle>Productos ({filteredProducts.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] md:h-[500px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                    onClick={() => addToCart(product)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center">
                        <Package className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm">{product.name}</h3>
                        <p className="text-lg font-bold text-primary">S/. {product.price.toFixed(2)}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <Badge variant={product.stock > 10 ? "default" : "destructive"} className="text-xs">
                            Stock: {product.stock}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{product.category}</span>
                        </div>
                      </div>
                      <Button size="sm" className="touch-target">
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Panel de tickets y carrito */}
      <div className="space-y-4">
        {/* Gestión de tickets */}
        <Card className="pos-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Tickets ({tickets.length})</CardTitle>
              <Button onClick={createNewTicket} size="sm" className="touch-target">
                <Plus className="h-4 w-4 mr-1" />
                Nuevo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-20">
              <div className="flex gap-2 overflow-x-auto">
                {tickets.map((ticket) => (
                  <div
                    key={ticket.id}
                    className={`border rounded-lg p-3 min-w-[120px] cursor-pointer transition-all relative ${
                      ticket.id === activeTicketId
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setActiveTicketId(ticket.id)}
                  >
                    <div className="text-sm font-semibold">{ticket.id}</div>
                    <div className="text-xs text-muted-foreground">
                      {ticket.items.length} items
                    </div>
                    <div className="text-sm font-bold text-primary">
                      S/. {ticket.total.toFixed(2)}
                    </div>
                    
                    {tickets.length > 1 && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTicket(ticket.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Carrito activo */}
        <Card className="pos-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                <ShoppingCart className="h-5 w-5 inline mr-2" />
                Carrito {activeTicket?.id}
              </CardTitle>
              <Button variant="outline" size="sm" className="touch-target">
                <User className="h-4 w-4 mr-1" />
                Cliente
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 mb-4">
              {activeTicket?.items.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Carrito vacío</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {activeTicket?.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-3 p-2 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{item.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          S/. {item.price.toFixed(2)} c/u
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="h-8 w-8 p-0 touch-target"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="font-semibold min-w-[2rem] text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="h-8 w-8 p-0 touch-target"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeFromCart(item.id)}
                          className="h-8 w-8 p-0 touch-target"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <div className="font-bold">
                          S/. {(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>

            <Separator className="my-4" />

            {/* Total */}
            <div className="space-y-2">
              <div className="flex justify-between text-lg">
                <span>Subtotal:</span>
                <span>S/. {activeTicket?.total.toFixed(2) || '0.00'}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>IGV (18%):</span>
                <span>S/. {((activeTicket?.total || 0) * 0.18).toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-xl font-bold">
                <span>Total:</span>
                <span className="text-primary">S/. {((activeTicket?.total || 0) * 1.18).toFixed(2)}</span>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="space-y-2 mt-6">
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" className="touch-target">
                  <Calculator className="h-4 w-4 mr-1" />
                  Calcular
                </Button>
                <Button variant="outline" className="touch-target">
                  <Printer className="h-4 w-4 mr-1" />
                  Imprimir
                </Button>
              </div>
              
              {/* Métodos de pago */}
              <Tabs defaultValue="efectivo" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="efectivo" className="text-xs">
                    <Banknote className="h-3 w-3" />
                  </TabsTrigger>
                  <TabsTrigger value="yape" className="text-xs">
                    <Smartphone className="h-3 w-3" />
                  </TabsTrigger>
                  <TabsTrigger value="plin" className="text-xs">
                    <Smartphone className="h-3 w-3" />
                  </TabsTrigger>
                  <TabsTrigger value="tarjeta" className="text-xs">
                    <CreditCard className="h-3 w-3" />
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="efectivo">
                  <Button
                    onClick={() => processSale('efectivo')}
                    className="w-full pos-button"
                    disabled={!activeTicket?.items.length}
                  >
                    <Banknote className="h-4 w-4 mr-2" />
                    Pagar en Efectivo
                  </Button>
                </TabsContent>
                
                <TabsContent value="yape">
                  <Button
                    onClick={() => processSale('Yape')}
                    className="w-full pos-button"
                    disabled={!activeTicket?.items.length}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Pagar con Yape
                  </Button>
                </TabsContent>
                
                <TabsContent value="plin">
                  <Button
                    onClick={() => processSale('Plin')}
                    className="w-full pos-button"
                    disabled={!activeTicket?.items.length}
                  >
                    <Smartphone className="h-4 w-4 mr-2" />
                    Pagar con Plin
                  </Button>
                </TabsContent>
                
                <TabsContent value="tarjeta">
                  <Button
                    onClick={() => processSale('tarjeta')}
                    className="w-full pos-button"
                    disabled={!activeTicket?.items.length}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Pagar con Tarjeta
                  </Button>
                </TabsContent>
              </Tabs>

              <Button variant="outline" className="w-full touch-target">
                <Save className="h-4 w-4 mr-2" />
                Guardar Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default POS;
