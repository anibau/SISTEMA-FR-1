
import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { Input } from "../ui/input";

interface NewClientProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ClientFormData {
  dni: string;
  nombres: string;
  apellidos: string;
  telefono: string;
  birthdate: Date;
}

const NewClient: React.FC<NewClientProps> = ({ isOpen, onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<ClientFormData>();

  const onSubmit = (data: ClientFormData) => {
    console.log(data);
    // Aquí puedes agregar la lógica para manejar el envío del formulario
    reset(); // Limpiar el formulario
    onClose(); // Cerrar el modal después de enviar
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold mb-6">Nuevo Cliente</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="dni" className="text-sm font-medium">DNI</label>
            <Input
              id="dni"
              type="text"
              {...register("dni", {
                required: "El DNI es requerido",
                pattern: {
                  value: /^\d{8}$/,
                  message: "El DNI debe tener 8 dígitos"
                }
              })}
              className={errors.dni ? "border-red-500" : ""}
            />
            {errors.dni && <span className="text-sm text-red-500">{String(errors.dni.message)}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="nombres" className="text-sm font-medium">Nombres</label>
            <Input
              id="nombres"
              type="text"
              {...register("nombres", { required: "Los nombres son requeridos" })}
              className={errors.nombres ? "border-red-500" : ""}
            />
            {errors.nombres && <span className="text-sm text-red-500">{String(errors.nombres.message)}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="apellidos" className="text-sm font-medium">Apellidos</label>
            <Input
              id="apellidos"
              type="text"
              {...register("apellidos", { required: "Los apellidos son requeridos" })}
              className={errors.apellidos ? "border-red-500" : ""}
            />
            {errors.apellidos && <span className="text-sm text-red-500">{String(errors.apellidos.message)}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="telefono" className="text-sm font-medium">Teléfono</label>
            <Input
              id="telefono"
              type="tel"
              {...register("telefono", { 
                required: "El teléfono es requerido",
                pattern: {
                  value: /^\d{9}$/,
                  message: "El teléfono debe tener 9 dígitos"
                }
              })}
              className={errors.telefono ? "border-red-500" : ""}
            />
            {errors.telefono && <span className="text-sm text-red-500">{String(errors.telefono.message)}</span>}
          </div>

          <div className="space-y-2">
            <label htmlFor="birthdate" className="text-sm font-medium">Fecha nacimiento</label>
            <Input
              id="birthdate"
              type="date"
              max={new Date().toISOString().split('T')[0]}
              {...register("birthdate", {
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
              })}
              className={errors.birthdate ? "border-red-500" : ""}
            />
            {errors.birthdate && (
              <span className="text-sm text-red-500">
                {errors.birthdate.message}
              </span>
            )}
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
            >
              Guardar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewClient;
