import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { BulkPriceUpdate, StockAdjustment } from '@/types/pos.types';
import { showSuccess, showError } from '@/lib/toast';

// Obtiene los productos destacados
export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productsService.getFeaturedProducts(),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
};

// Obtiene las estadísticas del inventario
export const useInventoryStats = () => {
  return useQuery({
    queryKey: ['inventory', 'stats'],
    queryFn: () => productsService.getInventoryStats(),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Obtiene todas las categorías detalladas
export const useProductCategories = () => {
  return useQuery({
    queryKey: ['products', 'categories', 'all'],
    queryFn: () => productsService.getProductCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Obtiene todas las marcas
export const useProductBrands = () => {
  return useQuery({
    queryKey: ['products', 'brands'],
    queryFn: () => productsService.getBrands(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Obtiene todos los proveedores
export const useProductSuppliers = () => {
  return useQuery({
    queryKey: ['products', 'suppliers'],
    queryFn: () => productsService.getSuppliers(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

// Hook para actualizar precios en lote
export const useBulkUpdatePrices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (updateData: BulkPriceUpdate) => productsService.bulkUpdatePrices(updateData),
    onSuccess: (result) => {
      showSuccess(`Se actualizaron ${result.updated} productos correctamente`);
      if (result.errors.length > 0) {
        console.warn('Algunos productos no pudieron ser actualizados:', result.errors);
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
    onError: (error) => {
      showError('Error al actualizar los precios');
      console.error('Error updating prices:', error);
    },
  });
};

// Hook para obtener productos con stock bajo
export const useLowStockProductsAdvanced = (includeOutOfStock: boolean = true) => {
  return useQuery({
    queryKey: ['products', 'low-stock', { includeOutOfStock }],
    queryFn: () => productsService.getLowStockProducts(includeOutOfStock),
    staleTime: 2 * 60 * 1000, // 2 minutos para stock
  });
};

// Hook para obtener producto por código
export const useProductByCode = (code: string) => {
  return useQuery({
    queryKey: ['product', 'code', code],
    queryFn: () => productsService.getProductByCode(code),
    enabled: !!code && code.length >= 3,
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
};

// Hook para ajustar el stock de un producto
export const useAdjustStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (adjustment: StockAdjustment) => productsService.adjustStock(adjustment),
    onSuccess: (updatedProduct) => {
      showSuccess('Stock ajustado correctamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'low-stock'] });
      queryClient.setQueryData(['product', updatedProduct.id], updatedProduct);
    },
    onError: (error) => {
      showError('Error al ajustar el stock');
      console.error('Error adjusting stock:', error);
    },
  });
};