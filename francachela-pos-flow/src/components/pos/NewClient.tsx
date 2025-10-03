
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Phone, User, CreditCard, Calendar } from "lucide-react";

interface NewClientProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit?: (data: ClientFormData) => void;
}

interface ClientFormData {
  dni: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  birthdate: string;
  creditLimit?: number;
}

const NewClient: React.FC<NewClientProps> = ({ 
  open, 
  onOpenChange,
  onSubmit
}) => {
  const form = useForm<ClientFormData>({
    defaultValues: {
      dni: "",
      name: "",
      phone: "",
      email: "",
      address: "",
      birthdate: "",
      creditLimit: 0
    }
  });

  const handleSubmit = (data: ClientFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
    form.reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Nuevo Cliente</DialogTitle>
          <DialogDescription>
            Registra un nuevo cliente en el sistema. Completa los datos requeridos.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="dni"
              rules={{ 
                required: "El DNI es requerido", 
                pattern: {
                  value: /^\d{8}$/,
                  message: "El DNI debe tener 8 dígitos"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <CreditCard className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="12345678" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              rules={{ required: "El nombre completo es requerido" }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre completo</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <User className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="Nombre y apellidos" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              rules={{ 
                required: "El teléfono es requerido",
                pattern: {
                  value: /^\d{9}$/,
                  message: "El teléfono debe tener 9 dígitos"
                }
              }}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input placeholder="987654321" className="pl-9" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                rules={{ 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Email inválido"
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="cliente@example.com" {...field} />
                    </FormControl>
                    <FormDescription>
                      Opcional
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Av. Ejemplo 123" {...field} />
                    </FormControl>
                    <FormDescription>
                      Opcional
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="birthdate"
                rules={{
                  required: "La fecha de nacimiento es requerida",
                  validate: {
                    futureDate: (value) => {
                      const date = new Date(value);
                      const today = new Date();
                      return date <= today || "La fecha no puede ser futura";
                    },
                    minAge: (value) => {
                      const date = new Date(value);
                      const today = new Date();
                      
                      // Calculamos la fecha hace 18 años
                      const minDate = new Date(today);
                      minDate.setFullYear(today.getFullYear() - 18);
                      
                      // Si la fecha de nacimiento es posterior a minDate, la persona es menor de 18
                      return date <= minDate || "Debe ser mayor de 18 años";
                    }
                  }
                }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha de nacimiento</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          type="date" 
                          max={new Date().toISOString().split('T')[0]} 
                          className="pl-9" 
                          {...field} 
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="creditLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Límite de crédito (S/.)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground">S/.</span>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          className="pl-9"
                          {...field}
                          onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : 0)} 
                        />
                      </div>
                    </FormControl>
                    <FormDescription>
                      Opcional. Crédito máximo que puede tener este cliente.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                className="mr-2"
              >
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Cliente
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default NewClient;
