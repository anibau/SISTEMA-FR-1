
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ShoppingCart,
  BarChart3,
  Package,
  Users,
  Gift,
  TrendingUp,
  Smartphone,
  Star
} from "lucide-react";

const Index = () => {
  return (
    <div className="space-y-6">
      {/* Header de bienvenida */}
      <div className="text-center py-8">
        <div className="flex justify-center mb-4">
          <div className="francachela-gradient p-4 rounded-2xl">
            <Smartphone className="h-12 w-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl font-bold mb-2">Francachela POS</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Sistema completo de punto de venta y administración para tu licorería.
          Gestiona ventas, inventario, clientes y promociones de manera eficiente.
        </p>
      </div>

      {/* Accesos rápidos principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to="/pos">
          <Card className="pos-card hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="francachela-gradient p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <ShoppingCart className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Punto de Venta</CardTitle>
                  <CardDescription>Procesar ventas rápidamente</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Interfaz optimizada para ventas táctiles, gestión de tickets múltiples y aplicación automática de promociones.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/dashboard">
          <Card className="pos-card hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="francachela-gradient p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <BarChart3 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Dashboard</CardTitle>
                  <CardDescription>Métricas y reportes</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Visualiza ventas, productos más vendidos, ranking de clientes y KPIs importantes de tu negocio.
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/inventario">
          <Card className="pos-card hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="francachela-gradient p-3 rounded-xl group-hover:scale-110 transition-transform">
                  <Package className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Inventario</CardTitle>
                  <CardDescription>Gestionar productos</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Control de stock, precios, códigos de barras y alertas de inventario mínimo.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Funcionalidades adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/clientes">
          <Card className="pos-card hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg">Clientes</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Registro, puntos de fidelidad y ventas fiadas
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/ventas">
          <Card className="pos-card hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg">Ventas</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Historial detallado y reportes de ventas
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/promociones">
          <Card className="pos-card hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Gift className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg">Promociones</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Combos, descuentos y ofertas especiales
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link to="/catalogo">
          <Card className="pos-card hover:shadow-xl transition-all duration-300 cursor-pointer group">
            <CardHeader className="pb-2">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 text-primary group-hover:scale-110 transition-transform" />
                <CardTitle className="text-lg">Catálogo</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Vista pública para pedidos por WhatsApp
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="pos-card text-center">
          <div className="text-2xl font-bold text-primary">S/. 2,450</div>
          <div className="text-sm text-muted-foreground">Ventas de hoy</div>
        </div>
        <div className="pos-card text-center">
          <div className="text-2xl font-bold text-primary">47</div>
          <div className="text-sm text-muted-foreground">Tickets procesados</div>
        </div>
        <div className="pos-card text-center">
          <div className="text-2xl font-bold text-primary">12</div>
          <div className="text-sm text-muted-foreground">Productos por agotar</div>
        </div>
        <div className="pos-card text-center">
          <div className="text-2xl font-bold text-primary">156</div>
          <div className="text-sm text-muted-foreground">Clientes registrados</div>
        </div>
      </div>
    </div>
  );
};

export default Index;
