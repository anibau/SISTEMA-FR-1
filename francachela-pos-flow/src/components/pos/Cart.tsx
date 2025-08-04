import { ShoppingCart, User, Calculator, Printer, Save, Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { CartItem as CartItemType, Ticket } from "@/types/pos.types";

interface CartProps {
  ticket: Ticket | undefined;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClientClick: () => void;
  onProcessPayment: (method: string) => void;
  onSaveTicket: () => void;
}

export const Cart = ({
  ticket,
  onUpdateQuantity,
  onRemoveItem,
  onClientClick,
  onProcessPayment,
  onSaveTicket,
}: CartProps) => {
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
            onProcessPayment={onProcessPayment}
            onSaveTicket={onSaveTicket}
            disabled={!ticket?.items.length}
          />
        </div>
      </CardContent>
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

const CartActions = ({
  onProcessPayment,
  onSaveTicket,
  disabled
}: {
  onProcessPayment: (method: string) => void;
  onSaveTicket: () => void;
  disabled: boolean;
}) => (
  <>
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
    <div className="grid grid-cols-4 gap-2">
      <Button
        onClick={() => onProcessPayment('efectivo')}
        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs"
        disabled={disabled}
      >
        Efectivo
      </Button>
      <Button
        onClick={() => onProcessPayment('tarjeta')}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
        disabled={disabled}
      >
        Tarjeta
      </Button>
      <Button
        onClick={() => onProcessPayment('yape')}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs"
        disabled={disabled}
      >
        Yape
      </Button>
      <Button
        onClick={() => onProcessPayment('plin')}
        className="w-full bg-orange-600 hover:bg-orange-700 text-white text-xs"
        disabled={disabled}
      >
        Plin
      </Button>
    </div>
    <Button 
      variant="outline" 
      className="w-full touch-target mt-4"
      onClick={onSaveTicket}
      disabled={disabled}
    >
      <Save className="h-4 w-4 mr-2" />
      Guardar Ticket
    </Button>
  </>
);
