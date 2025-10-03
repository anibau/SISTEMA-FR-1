import { useState, useEffect, useRef } from "react";
import { 
  Package, 
  Search, 
  X, 
  Plus, 
  ShoppingCart, 
  User,
  Minus,
  Trash2,
  Calculator,
  Printer,
  Banknote,
  Smartphone,
  CreditCard,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { SearchBar } from "@/components/pos/SearchBar";
import { TicketList } from "@/components/pos/TicketList";
import { Cart } from "@/components/pos/Cart";
import { usePOSStore } from "@/store/pos.store.new";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Client } from "@/types/pos.types";
import { showSuccess } from "@/lib/toast";
import NewClient from "@/components/pos/NewClient";
import useToggle from "@/hooks/useToogle";


const POS = () => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Estados locales UI
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearchOverlay, setShowSearchOverlay] = useState(false);
  const [showCategoryOverlay, setShowCategoryOverlay] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const { state: showNewClientModal, on: onNewClient, off: offNewClient } = useToggle();

  // Estado global
  const {
    tickets,
    activeTicketId,
    selectedCategory,
    products,
    clients,
    isLoading,
    error,
    setActiveTicketId,
    createNewTicket,
    addToCart,
    updateQuantity,
    removeFromCart,
    deleteTicket,
    processSale,
    filterProducts,
    setClientToTicket,
    setSelectedCategory,
    loadProducts,
    loadClients,
    searchClients,
    updateTicketObservations
  } = usePOSStore();

  // Obtener ticket activo
  const activeTicket = tickets.find(t => t.id === activeTicketId);

  // Productos filtrados por búsqueda y categoría
  const filteredProducts = filterProducts(searchTerm, selectedCategory);

  // Crear primer ticket si no hay ninguno
  useEffect(() => {
    if (tickets.length === 0) {
      createNewTicket();
    }
  }, [tickets.length, createNewTicket]);

  // Cargar datos al montar el componente
  useEffect(() => {
    loadProducts();
    loadClients();
  }, [loadProducts, loadClients]);

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

  const handleClientSelect = async (client: Client) => {
    if (activeTicketId) {
      setClientToTicket(activeTicketId, client);
      setShowClientModal(false);
      setClientSearch("");
    }
  };

  const handleClientSearch = async (query: string) => {
    setClientSearch(query);
    if (query.length >= 2) {
      const searchResults = await searchClients(query);
      // Los resultados se manejarán en el modal
    }
  };

  // Obtener tickets activos (no eliminados)
  const activeTickets = tickets.filter(t => t.status !== 'deleted');

  // Mostrar loading si está cargando datos
  if (isLoading && products.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando productos...</p>
        </div>
      </div>
    );
  }

  // Mostrar error si hay problemas
  if (error && products.length === 0) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <Button onClick={() => loadProducts()}>
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col gap-6">
      {/* Barra de búsqueda */}
      <div className="flex gap-2">
        <SearchBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onProductSelect={(product) => {
            addToCart(product);
            setShowSearchOverlay(false);
            setSearchTerm("");
          }}
          filteredProducts={filteredProducts}
          showOverlay={showSearchOverlay}
          setShowOverlay={setShowSearchOverlay}
        />
        
        
      </div>

      <div className="flex-1 flex flex-col gap-4">
        {/* Lista de tickets */}
        <TicketList
          tickets={tickets}
          activeTicketId={activeTicketId}
          onTicketSelect={setActiveTicketId}
          onTicketDelete={deleteTicket}
          onNewTicket={createNewTicket}
        />

        {/* Carrito */}
        <Cart
          ticket={activeTicket}
          onUpdateQuantity={updateQuantity}
          onRemoveItem={removeFromCart}
          onClientClick={() => setShowClientModal(true)}
          onProcessPayment={method => {
            if (activeTicketId) {
              const ticket = tickets.find(t => t.id === activeTicketId);
              processSale(activeTicketId, method);
              
              // Mostrar un mensaje específico según el método de pago
              const methodNames = {
                "efectivo": "Efectivo",
                "tarjeta": "Tarjeta",
                "yape": "Yape",
                "plin": "Plin",
              };
              
              const methodName = methodNames[method as keyof typeof methodNames] || method;
              const total = ticket?.total || 0;
              showSuccess(`Venta procesada con ${methodName}. Total: S/. ${total.toFixed(2)}`);
            }
          }}
          onProcessSale={() => {
            // This now just shows the payment modal
            // Payment processing happens in onProcessPayment
          }}
          onSaveTicket={() => showSuccess("Ticket guardado")}
          onUpdateObservations={(observations) => {
            if (activeTicketId) {
              updateTicketObservations(activeTicketId, observations);
            }
          }}
        />
      </div>

      {/* Overlay de categorías */}
      {showCategoryOverlay && (
        <div className="fixed inset-0 z-50 flex">
          <div className="bg-white shadow-lg w-64 h-full overflow-y-auto p-4">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Categorías</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowCategoryOverlay(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {["Todos", "Cerveza", "Pisco", "Vodka", "Ron", "Whisky"].map((category) => (
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
          <div 
            className="flex-1" 
            onClick={() => setShowCategoryOverlay(false)} 
          />
        </div>
      )}

      {/* Modal de cliente */}
      {showClientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg">Seleccionar Cliente</span>
              <Button 
                size="sm" 
                variant="ghost" 
                onClick={() => setShowClientModal(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <Input
              placeholder="Buscar cliente..."
              value={clientSearch}
              onChange={e => handleClientSearch(e.target.value)}
              className="mb-4"
            />
            <div className="max-h-48 overflow-y-auto flex flex-col gap-2">
              {clients
                .filter(c => 
                  c.name.toLowerCase().includes(clientSearch.toLowerCase())
                )
                .map(client => (
                  <Button
                    key={client.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleClientSelect(client)}
                  >
                    {client.name}
                  </Button>
                ))
              }
            <Button
              variant="default"
              className="w-full justify-start mt-2"
              onClick={() => {
                setShowClientModal(false);
                onNewClient();
              }}
            >
              + Nuevo cliente
            </Button>
            </div>
          </div>
        </div>
      )}
      {showNewClientModal && <NewClient open={showNewClientModal} onOpenChange={offNewClient} />}

    </div>
  );
};

export default POS;
