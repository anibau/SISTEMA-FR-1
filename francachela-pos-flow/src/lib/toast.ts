import { toast, ToastOptions } from 'react-toastify';

// Configuración por defecto para todos los toasts
const defaultOptions: ToastOptions = {
  position: "top-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: "light",
};

// Función para mostrar toast de éxito
export const showSuccess = (message: string, options?: ToastOptions) => {
  return toast.success(message, { ...defaultOptions, ...options });
};

// Función para mostrar toast de error
export const showError = (message: string, options?: ToastOptions) => {
  return toast.error(message, { ...defaultOptions, ...options });
};

// Función para mostrar toast de información
export const showInfo = (message: string, options?: ToastOptions) => {
  return toast.info(message, { ...defaultOptions, ...options });
};

// Función para mostrar toast de advertencia
export const showWarning = (message: string, options?: ToastOptions) => {
  return toast.warning(message, { ...defaultOptions, ...options });
};

// Función para mostrar toast de carga
export const showLoading = (message: string, options?: ToastOptions) => {
  return toast.loading(message, { ...defaultOptions, ...options });
};

// Función para actualizar un toast existente
export const updateToast = (toastId: string | number, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: 5000,
  });
};

// Función para cerrar un toast específico
export const dismissToast = (toastId: string | number) => {
  toast.dismiss(toastId);
};

// Función para cerrar todos los toasts
export const dismissAllToasts = () => {
  toast.dismiss();
};

// Exportar la función toast original para casos especiales
export { toast }; 