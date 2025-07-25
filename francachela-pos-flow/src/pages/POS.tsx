
import { useState, useEffect, useRef } from "react";
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
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(sampleProducts);
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  // 1. Añadir estado para overlay de categorías y cliente
  const [showCategoryOverlay, setShowCategoryOverlay] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [clients] = useState([
    { id: "1", name: "Juan Pérez" },
    { id: "2", name: "María López" },
    { id: "3", name: "Carlos Ruiz" },
  ]);
  // Asociar cliente al ticket activo
  const setClientToActiveTicket = (client: { id: string; name: string }) => {
    setTickets(tickets.map(ticket =>
      ticket.id === activeTicketId
        ? { ...ticket, customer: client.name }
        : ticket
    ));
    setShowClientModal(false);
  };

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

  // Cerrar overlay al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchInputRef.current && !searchInputRef.current.contains(event.target as Node)) {
        setShowSearchOverlay(false);
      }
    }
    if (showSearchOverlay) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSearchOverlay]);

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

  // 2. Modificar categorías: eliminar 'Todos' y mostrar como overlay lateral
  const filteredCategories = categories.filter(c => c !== "Todos");

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Barra de búsqueda 100% ancho */}
      <div className="w-full relative">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              ref={searchInputRef}
              placeholder="Buscar productos o escanear código de barras..."
              value={searchTerm}
              onFocus={() => setShowSearchOverlay(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSearchOverlay(true);
              }}
              className="pl-10 pos-button !p-3 w-full"
            />
            {/* Overlay de resultados de búsqueda */}
            {showSearchOverlay && searchTerm && (
              <div className="absolute z-50 bg-white border rounded shadow-lg w-full max-h-80 overflow-auto mt-2">
                {filteredProducts.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">Sin resultados</div>
                ) : (
                  filteredProducts.map(product => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between px-4 py-2 hover:bg-muted cursor-pointer"
                      onClick={() => {
                        addToCart(product);
                        setShowSearchOverlay(false);
                        setSearchTerm("");
                      }}
                    >
                      <div>
                        <div className="font-semibold">{product.name}</div>
                        <div className="text-xs text-muted-foreground">Stock: {product.stock}</div>
                        <div className="font-bold text-primary">S/. {product.price.toFixed(2)}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {/* Botón para mostrar overlay de categorías */}
          <Button variant="outline" className="touch-target" onClick={() => setShowCategoryOverlay(true)}>
            <Package className="h-4 w-4 mr-2" />
            Categorías
          </Button>
        </div>
        {/* Overlay lateral de categorías */}
        {showCategoryOverlay && (
          <div className="fixed inset-0 z-50 flex">
            <div className="bg-white shadow-lg w-64 h-full overflow-y-auto p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-lg">Categorías</span>
                <Button size="sm" variant="ghost" onClick={() => setShowCategoryOverlay(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-2">
                {filteredCategories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setSelectedCategory(category);
                      setShowCategoryOverlay(false);
                    }}
                    className="whitespace-nowrap touch-target"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex-1" onClick={() => setShowCategoryOverlay(false)} />
          </div>
        )}
      </div>
      {/* Carrito principal con tickets arriba */}
      <div className="flex-1 flex flex-col gap-4">
        {/* Gestión de tickets arriba */}
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
        <Card className="pos-card flex-1 flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">
                <ShoppingCart className="h-5 w-5 inline mr-2" />
                Carrito {activeTicket?.id}
              </CardTitle>
              <Button variant="outline" size="sm" className="touch-target" onClick={() => setShowClientModal(true)}>
                <User className="h-4 w-4 mr-1" />
                {activeTicket?.customer ? activeTicket.customer : "Cliente"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col">
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
              <Button 
                variant="outline" 
                className="w-full touch-target mt-4"
                onClick={() => alert("Ticket guardado")}
              >
                <Save className="h-4 w-4 mr-2" />
                Guardar Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Modal de cliente */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Seleccionar Cliente</span>
              <Button size="sm" variant="ghost" onClick={() => setShowClientModal(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Buscar cliente..."
              value={clientSearch}
              onChange={e => setClientSearch(e.target.value)}
              className="mb-4"
            />
            <div className="max-h-48 overflow-y-auto flex flex-col gap-2">
              {clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase())).map(client => (
                <Button
                  key={client.id}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => setClientToActiveTicket(client)}
                >
                  {client.name}
                </Button>
              ))}
              <Button
                variant="default"
                className="w-full justify-start mt-2"
                onClick={() => {
                  if (clientSearch.trim()) {
                    setClientToActiveTicket({ id: Date.now().toString(), name: clientSearch });
                    setClientSearch("");
                  }
                }}
              >
                + Nuevo cliente: {clientSearch}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default POS;
