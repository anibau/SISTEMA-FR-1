import { useRef } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/pos.types";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onProductSelect: (product: Product) => void;
  filteredProducts: Product[];
  showOverlay: boolean;
  setShowOverlay: (show: boolean) => void;
}

export const SearchBar = ({
  searchTerm,
  onSearchChange,
  onProductSelect,
  filteredProducts,
  showOverlay,
  setShowOverlay,
}: SearchBarProps) => {
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full relative">
      <div className="flex-1 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          ref={searchInputRef}
          placeholder="Buscar productos o escanear código de barras..."
          value={searchTerm}
          onFocus={() => setShowOverlay(true)}
          onChange={(e) => {
            onSearchChange(e.target.value);
            setShowOverlay(true);
          }}
          className="pl-10 pos-button !p-3 w-full"
        />
        {showOverlay && searchTerm && (
          <div className="absolute z-50 bg-white border rounded shadow-lg w-full max-h-80 overflow-auto mt-2">
            {filteredProducts.length === 0 ? (
              <div className="p-4 text-center text-muted-foreground">Sin resultados</div>
            ) : (
              filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="flex items-center justify-between px-4 py-2 hover:bg-muted cursor-pointer"
                  onClick={() => {
                    onProductSelect(product);
                    setShowOverlay(false);
                    onSearchChange("");
                  }}
                >
                  <div>
                    <div className="font-semibold">{product.name}</div>
                    <div className="text-xs text-muted-foreground">Stock: {product.stock}</div>
                    <div className="font-bold text-primary">S/. {product.price.toFixed(2)}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
