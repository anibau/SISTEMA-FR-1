import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Percent, Gift, Package, Star, Calendar } from "lucide-react";

interface NewPromotionProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: PromotionFormData) => void;
}

interface PromotionFormData {
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'combo' | 'birthday';
  value: number;
  minAmount?: number;
  buyQuantity?: number;
  getQuantity?: number;
  applicableProducts: string;
  startDate: string;
  endDate: string;
  maxUsage?: number;
  conditions?: string;
}

const NewPromotion: React.FC<NewPromotionProps> = ({ 
  open, 
  onOpenChange,
  onSubmit 
}) => {
  const form = useForm<PromotionFormData>({
    defaultValues: {
      name: "",
      description: "",
      type: "percentage",
      value: 0,
      applicableProducts: "Todos",
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0],
    },
  });

  const selectedType = form.watch("type");

  const handleSubmit = (data: PromotionFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
    form.reset();
    onOpenChange(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage': return <Percent className="h-4 w-4 mr-2" />;
      case 'fixed_amount': return <Gift className="h-4 w-4 mr-2" />;
      case 'buy_x_get_y': return <Package className="h-4 w-4 mr-2" />;
      case 'combo': return <Star className="h-4 w-4 mr-2" />;
      case 'birthday': return <Calendar className="h-4 w-4 mr-2" />;
      default: return <Gift className="h-4 w-4 mr-2" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'percentage': return 'Porcentaje';
      case 'fixed_amount': return 'Monto Fijo';
      case 'buy_x_get_y': return 'Lleva X Paga Y';
      case 'combo': return 'Combo';
      case 'birthday': return 'Cumpleaños';
      default: return type;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Nueva Promoción</DialogTitle>
          <DialogDescription>
            Crea una nueva promoción para tus productos. Completa los campos necesarios.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            {/* Información básica */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                rules={{ required: "El nombre es requerido" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la promoción</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: 3x2 en Cervezas" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                rules={{ required: "La descripción es requerida" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe la promoción..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                rules={{ required: "Selecciona un tipo de promoción" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de promoción</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">
                          <div className="flex items-center">
                            <Percent className="h-4 w-4 mr-2" />
                            <span>Porcentaje</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="fixed_amount">
                          <div className="flex items-center">
                            <Gift className="h-4 w-4 mr-2" />
                            <span>Monto Fijo</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="buy_x_get_y">
                          <div className="flex items-center">
                            <Package className="h-4 w-4 mr-2" />
                            <span>Lleva X Paga Y</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="birthday">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>Cumpleaños</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Campos específicos según el tipo seleccionado */}
            {selectedType === "percentage" && (
              <FormField
                control={form.control}
                name="value"
                rules={{ 
                  required: "El porcentaje es requerido", 
                  min: { value: 1, message: "El descuento debe ser al menos 1%" }, 
                  max: { value: 100, message: "El descuento no puede superar el 100%" } 
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porcentaje de descuento</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          placeholder="10" 
                          className="pl-7"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                        />
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">%</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {selectedType === "fixed_amount" && (
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="value"
                  rules={{ 
                    required: "El monto de descuento es requerido", 
                    min: { value: 1, message: "El monto debe ser al menos 1" } 
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto de descuento (S/.)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="10.00" 
                            className="pl-7"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                          />
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2">S/.</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="minAmount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monto mínimo de compra (S/.)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="100.00" 
                            className="pl-7"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)} 
                          />
                          <span className="absolute left-2 top-1/2 transform -translate-y-1/2">S/.</span>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Opcional. Monto mínimo de compra para aplicar el descuento
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {selectedType === "buy_x_get_y" && (
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="buyQuantity"
                  rules={{ 
                    required: "Cantidad es requerida", 
                    min: { value: 1, message: "La cantidad debe ser al menos 1" } 
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Llevar</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="3"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="getQuantity"
                  rules={{ 
                    required: "Cantidad es requerida", 
                    min: { value: 1, message: "La cantidad debe ser al menos 1" },
                    validate: {
                      lessThanBuy: (value, values) => 
                        !values.buyQuantity || value <= values.buyQuantity || 
                        "La cantidad a pagar debe ser menor o igual a la cantidad a llevar"
                    }
                  }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pagar</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          placeholder="2"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {selectedType === "birthday" && (
              <FormField
                control={form.control}
                name="value"
                rules={{ 
                  required: "El porcentaje es requerido", 
                  min: { value: 1, message: "El descuento debe ser al menos 1%" }, 
                  max: { value: 100, message: "El descuento no puede superar el 100%" } 
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Porcentaje de descuento por cumpleaños</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          placeholder="15" 
                          className="pl-7"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))} 
                        />
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2">%</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Campos comunes */}
            <FormField
              control={form.control}
              name="applicableProducts"
              rules={{ required: "Los productos aplicables son requeridos" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Productos aplicables</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Cerveza, Vino, Todos" {...field} />
                  </FormControl>
                  <FormDescription>
                    Especifica los productos o categorías a los que aplica esta promoción. 
                    Escribe "Todos" si aplica a todo el inventario.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                rules={{ required: "La fecha de inicio es requerida" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de inicio</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endDate"
                rules={{ 
                  required: "La fecha de fin es requerida",
                  validate: {
                    afterStart: (value, values) => {
                      return new Date(value) >= new Date(values.startDate) || 
                        "La fecha de fin debe ser posterior a la fecha de inicio";
                    }
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de fin</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="maxUsage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Límite de uso</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="100" 
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)} 
                    />
                  </FormControl>
                  <FormDescription>
                    Opcional. Número máximo de veces que se puede usar esta promoción.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="conditions"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Condiciones adicionales</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Ej: No acumulable con otras ofertas"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    Opcional. Especifica condiciones o restricciones adicionales.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button type="submit">
                Crear Promoción
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewPromotion;