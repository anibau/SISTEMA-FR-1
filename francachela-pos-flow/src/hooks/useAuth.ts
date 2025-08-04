import { useAuthContext } from '@/contexts/AuthContext';

export const useAuth = () => {
  return useAuthContext();
};

export const useUser = () => {
  const { user, isLoading, isAuthenticated } = useAuthContext();
  
  return {
    user,
    isLoading,
    isAuthenticated,
  };
};

export const usePermissions = () => {
  const { user } = useAuthContext();

  const isAdmin = user?.role === 'admin';
  const isVendedor = user?.role === 'vendedor';
  const isCajero = user?.role === 'cajero';

  const canManageProducts = isAdmin || isVendedor;
  const canManageUsers = isAdmin;
  const canViewReports = isAdmin || isVendedor;
  const canManagePromotions = isAdmin;
  const canProcessSales = isAdmin || isVendedor || isCajero;
  const canManageInventory = isAdmin || isVendedor;
  const canManageCustomers = isAdmin || isVendedor;

  return {
    isAdmin,
    isVendedor,
    isCajero,
    canManageProducts,
    canManageUsers,
    canViewReports,
    canManagePromotions,
    canProcessSales,
    canManageInventory,
    canManageCustomers,
  };
}; 