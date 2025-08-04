
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { showSuccess } from "@/lib/toast";
import {
  Search,
  ShoppingCart,
  Star,
  Filter,
  Smartphone,
  Heart,
  Share2,
  Package,
  MessageCircle
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  category: string;
  image?: string;
  rating: number;
  reviews: number;
  featured: boolean;
  discount?: number;
}

const catalogProducts: Product[] = [
  {
    id: "1",
    name: "Cerveza Pilsen 650ml",
    price: 4.50,
    description: "Cerveza rubia de sabor equilibrado y refrescante",
    category: "Cerveza",
    rating: 4.5,
    reviews: 128,
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: "2",
    name: "Pisco Queirolo Acholado 750ml",
    price: 28.90,
    originalPrice: 35.90,
    description: "Pisco acholado de uvas seleccionadas, ideal para cócteles",
    category: "Pisco",
    rating: 4.8,
    reviews: 89,
    featured: true,
    discount: 20,
    image: "/placeholder.svg"
  },
  {
    id: "3",
    name: "Vodka Absolut 750ml",
    price: 65.00,
    description: "Vodka premium sueco de alta calidad",
    category: "Vodka",
    rating: 4.7,
    reviews: 156,
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: "4",
    name: "Ron Cartavio XO 750ml",
    price: 45.50,
    description: "Ron añejado con notas dulces y acarameladas",
    category: "Ron",
    rating: 4.6,
    reviews: 73,
    featured: true,
    image: "/placeholder.svg"
  },
  {
    id: "5",
    name: "Whisky Johnnie Walker Red Label",
    price: 89.90,
    description: "Whisky escocés mezclado con carácter distintivo",
    category: "Whisky",
    rating: 4.9,
    reviews: 201,
    featured: false,
    image: "/placeholder.svg"
  },
  {
    id: "6",
    name: "Vino Tacama Reserva Especial",
    price: 32.50,
    originalPrice: 42.00,
    description: "Vino tinto de cepa Cabernet Sauvignon",
    category: "Vino",
    rating: 4.4,
    reviews: 95,
    featured: true,
    discount: 23,
    image: "/placeholder.svg"
  }
];

const Catalog = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [filteredProducts, setFilteredProducts] = useState(catalogProducts);
  const [favorites, setFavorites] = useState<string[]>([]);

  const categories = ["Todos", "Cerveza", "Pisco", "Vodka", "Ron", "Whisky", "Vino"];
  const featuredProducts = catalogProducts.filter(p => p.featured);

  useEffect(() => {
    let filtered = catalogProducts;
    
    if (selectedCategory !== "Todos") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const sendWhatsAppMessage = (product: Product) => {
    const message = `¡Hola! Me interesa el producto:\n\n*${product.name}*\nPrecio: S/. ${product.price.toFixed(2)}\n\n¿Está disponible?`;
    const phoneNumber = "51987654321"; // Reemplazar con el número real
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const shareProduct = (product: Product) => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href
      });
    } else {
      // Fallback para copiar al portapapeles
      navigator.clipboard.writeText(`${product.name} - S/. ${product.price.toFixed(2)} - ${window.location.href}`);
      showSuccess('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header público */}
      <header className="francachela-gradient text-white py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <Smartphone className="h-16 w-16" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Francachela</h1>
            <p className="text-xl opacity-90 mb-4">Tu tienda de licores de confianza</p>
            <p className="text-lg opacity-80">
              Los mejores licores con delivery a domicilio
            </p>
            
            {/* Información de contacto */}
            <div className="flex flex-col md:flex-row justify-center items-center space-y-2 md:space-y-0 md:space-x-6 mt-6 text-sm">
              <div className="flex items-center space-x-2">
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp: +51 987 654 321</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4" />
                <span>Delivery gratuito en pedidos mayores a S/. 50</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Búsqueda y filtros */}
        <Card className="pos-card">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar productos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pos-button !p-3"
                />
              </div>
              <Button variant="outline" className="touch-target">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
            
            {/* Categorías */}
            <div className="flex gap-2 mt-4 overflow-x-auto">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="whitespace-nowrap touch-target"
                >
                  {category}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Productos destacados */}
        {selectedCategory === "Todos" && (
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center">
              <Star className="h-6 w-6 mr-2 text-yellow-500" />
              Productos Destacados
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <Card key={product.id} className="pos-card hover:shadow-xl transition-all duration-300 group">
                  <CardHeader className="relative">
                    {product.discount && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                        -{product.discount}%
                      </Badge>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 touch-target"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart 
                        className={`h-5 w-5 ${
                          favorites.includes(product.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-muted-foreground'
                        }`} 
                      />
                    </Button>
                    
                    <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
                      <Package className="h-16 w-16 text-muted-foreground" />
                    </div>
                    
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground text-sm mb-3">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.floor(product.rating)
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        ({product.reviews})
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="text-2xl font-bold text-primary">
                          S/. {product.price.toFixed(2)}
                        </div>
                        {product.originalPrice && (
                          <div className="text-sm text-muted-foreground line-through">
                            S/. {product.originalPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => shareProduct(product)}
                        className="touch-target"
                      >
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button
                      onClick={() => sendWhatsAppMessage(product)}
                      className="w-full pos-button bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Pedir por WhatsApp
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Todos los productos */}
        <section>
          <h2 className="text-2xl font-bold mb-6">
            {selectedCategory === "Todos" ? "Todos los Productos" : selectedCategory}
            <span className="text-muted-foreground text-lg ml-2">
              ({filteredProducts.length})
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="pos-card hover:shadow-xl transition-all duration-300 group">
                <CardHeader className="relative pb-3">
                  {product.discount && (
                    <Badge className="absolute top-2 left-2 bg-red-500 text-white">
                      -{product.discount}%
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 touch-target"
                    onClick={() => toggleFavorite(product.id)}
                  >
                    <Heart 
                      className={`h-4 w-4 ${
                        favorites.includes(product.id) 
                          ? 'fill-red-500 text-red-500' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                  </Button>
                  
                  <div className="w-full h-32 bg-muted rounded-lg flex items-center justify-center mb-3">
                    <Package className="h-12 w-12 text-muted-foreground" />
                  </div>
                  
                  <CardTitle className="text-base group-hover:text-primary transition-colors">
                    {product.name}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <div className="flex items-center space-x-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-xl font-bold text-primary">
                      S/. {product.price.toFixed(2)}
                    </div>
                    {product.originalPrice && (
                      <div className="text-xs text-muted-foreground line-through">
                        S/. {product.originalPrice.toFixed(2)}
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={() => sendWhatsAppMessage(product)}
                    size="sm"
                    className="w-full bg-green-600 hover:bg-green-700 touch-target"
                  >
                    <MessageCircle className="h-3 w-3 mr-1" />
                    Pedir
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
              <p className="text-muted-foreground">
                Intenta con otros términos de búsqueda o selecciona otra categoría
              </p>
            </div>
          )}
        </section>

        {/* Footer informativo */}
        <footer className="border-t pt-8 mt-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-3">Contacto</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>📱 WhatsApp: +51 987 654 321</p>
                <p>📧 Email: ventas@francachela.com</p>
                <p>📍 Dirección: Av. Principal 123, Lima</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Horarios</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>Lunes a Sábado: 9:00 AM - 10:00 PM</p>
                <p>Domingos: 10:00 AM - 8:00 PM</p>
                <p>Delivery hasta las 9:00 PM</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-3">Información</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>✅ Productos originales garantizados</p>
                <p>🚚 Delivery gratuito {">="} S/. 50</p>
                <p>💳 Aceptamos todos los medios de pago</p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-4 border-t text-sm text-muted-foreground">
            <p>© 2024 Francachela - Tu tienda de licores. Todos los derechos reservados.</p>
            <p className="mt-1">Prohibida la venta de bebidas alcohólicas a menores de 18 años.</p>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Catalog;
