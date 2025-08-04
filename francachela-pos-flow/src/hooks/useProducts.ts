import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productsService } from '@/services/products.service';
import { Product, SearchFilters, PaginationParams } from '@/types/pos.types';
import { showSuccess, showError, showWarning } from '@/lib/toast';

export const useProducts = (params?: PaginationParams) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    gcTime: 10 * 60 * 1000, // 10 minutos
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => productsService.getProductById(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};

export const useSearchProducts = (query: string, filters?: SearchFilters) => {
  return useQuery({
    queryKey: ['products', 'search', query, filters],
    queryFn: () => productsService.searchProducts(query, filters),
    enabled: !!query && query.length >= 2,
    staleTime: 2 * 60 * 1000, // 2 minutos para búsquedas
  });
};

export const useProductByBarcode = (barcode: string) => {
  return useQuery({
    queryKey: ['product', 'barcode', barcode],
    queryFn: () => productsService.getProductByBarcode(barcode),
    enabled: !!barcode && barcode.length >= 3,
    staleTime: 10 * 60 * 1000, // 10 minutos para códigos de barras
  });
};

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => productsService.getCategories(),
    staleTime: 30 * 60 * 1000, // 30 minutos
  });
};

export const useLowStockProducts = (threshold: number = 10) => {
  return useQuery({
    queryKey: ['products', 'low-stock', threshold],
    queryFn: () => productsService.getLowStockProducts(threshold),
    staleTime: 2 * 60 * 1000, // 2 minutos para stock
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) =>
      productsService.createProduct(product),
    onSuccess: (newProduct) => {
      showSuccess('Producto creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.setQueryData(['product', newProduct.id], newProduct);
    },
    onError: (error) => {
      showError('Error al crear el producto');
      console.error('Error creating product:', error);
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      productsService.updateProduct(id, updates),
    onSuccess: (updatedProduct) => {
      showSuccess('Producto actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.setQueryData(['product', updatedProduct.id], updatedProduct);
    },
    onError: (error) => {
      showError('Error al actualizar el producto');
      console.error('Error updating product:', error);
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => productsService.deleteProduct(id),
    onSuccess: (_, deletedId) => {
      showSuccess('Producto eliminado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.removeQueries({ queryKey: ['product', deletedId] });
    },
    onError: (error) => {
      showError('Error al eliminar el producto');
      console.error('Error deleting product:', error);
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newStock }: { id: string; newStock: number }) =>
      productsService.updateStock(id, newStock),
    onSuccess: (updatedProduct) => {
      showSuccess('Stock actualizado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', 'low-stock'] });
      queryClient.setQueryData(['product', updatedProduct.id], updatedProduct);
    },
    onError: (error) => {
      showError('Error al actualizar el stock');
      console.error('Error updating stock:', error);
    },
  });
};

export const useImportProducts = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => productsService.importProducts(file),
    onSuccess: (result) => {
      const message = `Importación completada: ${result.success} productos importados`;
      if (result.errors.length > 0) {
        showWarning(`${message}. ${result.errors.length} errores encontrados.`);
      } else {
        showSuccess(message);
      }
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
    onError: (error) => {
      showError('Error al importar productos');
      console.error('Error importing products:', error);
    },
  });
};

export const useExportProducts = () => {
  return useMutation({
    mutationFn: (format: 'excel' | 'csv') => productsService.exportProducts(format),
    onSuccess: (blob, format) => {
      // Crear descarga automática
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `productos_${new Date().toISOString().split('T')[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      showSuccess('Exportación completada');
    },
    onError: (error) => {
      showError('Error al exportar productos');
      console.error('Error exporting products:', error);
    },
  });
}; 