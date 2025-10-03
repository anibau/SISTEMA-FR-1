import { 
  ShoppingCart, 
  User, 
  Calculator, 
  Printer, 
  Save, 
  Minus, 
  Plus, 
  Trash2,
  Banknote,
  CreditCard,
  Smartphone,
  X,
  Landmark,
  QrCode
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CartItem as CartItemType, Ticket } from "@/types/pos.types";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";

interface CartProps {
  ticket: Ticket | undefined;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClientClick: () => void;
  onProcessPayment: (method: string) => void;
  onProcessSale: () => void;  // New function to process sale directly
  onSaveTicket: () => void;
  onUpdateObservations?: (observations: string) => void;
}

export const Cart = ({
  ticket,
  onUpdateQuantity,
  onRemoveItem,
  onClientClick,
  onProcessPayment,
  onProcessSale,
  onSaveTicket,
  onUpdateObservations,
}: CartProps) => {
  const [observations, setObservations] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  
  // Update local state when the ticket changes
  useEffect(() => {
    if (ticket?.observations) {
      setObservations(ticket.observations);
    } else {
      setObservations("");
    }
  }, [ticket]);
  
  // Handle observations change
  const handleObservationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setObservations(newValue);
    
    if (ticket && onUpdateObservations) {
      onUpdateObservations(newValue);
    }
  };
  
  // Handle calculator click
  const handleCalculatorClick = () => {
    // Open Windows calculator
    window.open("calculator://", "_blank");
  };
  
  // Handle process sale button click
  const handleProcessSaleClick = () => {
    setShowPaymentModal(true);
  };
  
  // Handle payment method selection
  const handlePaymentMethodSelect = (method: string) => {
    onProcessPayment(method);
    setShowPaymentModal(false);
  };
  
  return (
    <Card className="pos-card flex-1 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">
            <ShoppingCart className="h-5 w-5 inline mr-2" />
            Carrito {ticket?.id}
          </CardTitle>
          <Button variant="outline" size="sm" className="touch-target" onClick={onClientClick}>
            <User className="h-4 w-4 mr-1" />
            {ticket?.customer ? ticket.customer : "Cliente"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <ScrollArea className="h-48 mb-4">
          {!ticket?.items.length ? (
            <div className="text-center text-muted-foreground py-8">
              <ShoppingCart className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Carrito vacío</p>
            </div>
          ) : (
            <div className="space-y-3">
              {ticket.items.map((item) => (
                <CartItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={onUpdateQuantity}
                  onRemove={onRemoveItem}
                />
              ))}
            </div>
          )}
        </ScrollArea>
        
        <Separator className="my-4" />
        
        <CartTotals ticket={ticket} />
        
        <div className="space-y-2 mt-6">
          <CartActions
            onProcessPayment={handlePaymentMethodSelect}
            onProcessSale={handleProcessSaleClick}
            onSaveTicket={onSaveTicket}
            disabled={!ticket?.items.length}
            observations={observations}
            handleObservationsChange={handleObservationsChange}
          />
        </div>
      </CardContent>
      
      {/* Payment Modal */}
      <ProcessSaleModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onConfirm={handlePaymentMethodSelect}
        totalAmount={ticket?.total || 0}
      />
    </Card>
  );
};

const CartItem = ({
  item,
  onUpdateQuantity,
  onRemove,
}: {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}) => (
  <div className="flex items-center space-x-3 p-2 border rounded-lg">
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
        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
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
        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        className="h-8 w-8 p-0 touch-target"
      >
        <Plus className="h-3 w-3" />
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => onRemove(item.id)}
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
);

const CartTotals = ({ ticket }: { ticket: Ticket | undefined }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-lg">
      <span>Subtotal:</span>
      <span>S/. {ticket?.total.toFixed(2) || '0.00'}</span>
    </div>
    <div className="flex justify-between text-sm text-muted-foreground">
      <span>IGV (18%):</span>
      <span>S/. {((ticket?.total || 0) * 0.18).toFixed(2)}</span>
    </div>
    <Separator />
    <div className="flex justify-between text-xl font-bold">
      <span>Total:</span>
      <span className="text-primary">S/. {((ticket?.total || 0) * 1.18).toFixed(2)}</span>
    </div>
  </div>
);

// Payment selection modal
interface ProcessSaleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (paymentMethod: string) => void;
  totalAmount: number;
}

const ProcessSaleModal = ({ isOpen, onClose, onConfirm, totalAmount }: ProcessSaleModalProps) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md animate-scaleIn">
        <h2 className="text-xl font-bold mb-4 flex items-center justify-between">
          <span>Finalizar Venta</span>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </h2>
        
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">Total a pagar:</p>
          <p className="text-2xl font-bold text-primary">S/. {(totalAmount * 1.18).toFixed(2)}</p>
        </div>
        
        <p className="text-sm font-medium mb-3">Seleccione método de pago:</p>
        
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white h-20 flex flex-col" 
            onClick={() => onConfirm("efectivo")}
          >
            <Banknote className="h-6 w-6 mb-2" />
            <span className="font-medium">Efectivo</span>
          </Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white h-20 flex flex-col"
            onClick={() => onConfirm("tarjeta")}
          >
            <CreditCard className="h-6 w-6 mb-2" />
            <span className="font-medium">Tarjeta</span>
          </Button>
          <Button 
            className="bg-purple-600 hover:bg-purple-700 text-white h-20 flex flex-col"
            onClick={() => onConfirm("yape")}
          >
            <Smartphone className="h-6 w-6 mb-2" />
            <span className="font-medium">Yape</span>
          </Button>
          <Button 
            className="bg-orange-600 hover:bg-orange-700 text-white h-20 flex flex-col"
            onClick={() => onConfirm("plin")}
          >
            <Smartphone className="h-6 w-6 mb-2" />
            <span className="font-medium">Plin</span>
          </Button>
        </div>
        
        <Button 
          variant="outline" 
          className="w-full"
          onClick={onClose}
        >
          Cancelar
        </Button>
      </div>
    </div>
  );
};

const CartActions = ({
  onProcessPayment,
  onProcessSale,
  onSaveTicket,
  disabled,
  observations,
  handleObservationsChange
}: {
  onProcessPayment: (method: string) => void;
  onProcessSale: () => void;
  onSaveTicket: () => void;
  disabled: boolean;
  observations: string;
  handleObservationsChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) => {
  // Function to open Windows calculator
  const handleCalculatorClick = () => {
    // Using calc: URL scheme to open calculator on Windows
    window.open("calc:");
  };

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          className="touch-target"
          onClick={handleCalculatorClick}
        >
          <Calculator className="h-4 w-4 mr-1" />
          Calcular
        </Button>
        <Button variant="outline" className="touch-target">
          <Printer className="h-4 w-4 mr-1" />
          Imprimir
        </Button>
      </div>
      <div className="mb-4 mt-4">
        <p className="text-sm text-muted-foreground mb-1">Observaciones:</p>
        <Textarea
          placeholder="Agregar observaciones al ticket..."
          value={observations}
          onChange={handleObservationsChange}
          className="h-4 text-sm"
        />
      </div>
      
      <div className="grid grid-cols-1 gap-2 mt-4">
        <Button 
          variant="outline" 
          className="touch-target w-full"
          onClick={onSaveTicket}
          disabled={disabled}
        >
          <Save className="h-4 w-4 mr-2" />
          Guardar Ticket
        </Button>
      </div>
      
      <Button 
        variant="default"
        className="touch-target mt-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 w-full"
        onClick={onProcessSale}
        disabled={disabled}
      >
        <ShoppingCart className="h-5 w-5 mr-2" />
        Pasar Venta
      </Button>
    </>
  );
};
