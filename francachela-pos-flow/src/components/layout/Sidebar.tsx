
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  TrendingUp,
  Gift,
  Menu,
  Smartphone,
  DollarSign,
  Award,
  Truck,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const menuItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Punto de Venta",
    href: "/pos",
    icon: ShoppingCart,
  },
  {
    title: "Inventario",
    href: "/inventario",
    icon: Package,
  },
  {
    title: "Productos",
    href: "/productos",
    icon: Package,
  },
  {
    title: "Clientes",
    href: "/clientes",
    icon: Users,
  },
  {
    title: "Ventas",
    href: "/ventas",
    icon: TrendingUp,
  },
  {
    title: "Promociones",
    href: "/promociones",
    icon: Gift,
  },
  {
    title: "Gastos",
    href: "/gastos",
    icon: DollarSign,
  },
  {
    title: "Puntos",
    href: "/puntos",
    icon: Award,
  },
  {
    title: "Delivery",
    href: "/delivery",
    icon: Truck,
  },
  {
    title: "Configuración",
    href: "/configuracion",
    icon: Settings,
  },
];

export const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const location = useLocation();

  return (
    <div
      className={cn(
        "bg-primary text-primary-foreground transition-all duration-300 ease-in-out flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header del sidebar */}
      <div className="p-4 border-b border-primary-foreground/20">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <Smartphone className="h-8 w-8" />
              <div>
                <h1 className="font-bold text-lg">Francachela</h1>
                <p className="text-xs opacity-80">Tu tienda de licores</p>
              </div>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="text-primary-foreground hover:bg-primary-foreground/20 touch-target"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 touch-target",
                "hover:bg-primary-foreground/10",
                isActive && "bg-primary-foreground/20 font-semibold"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!collapsed && <span className="text-sm">{item.title}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-primary-foreground/20">
        <Link
          to="/catalogo"
          className={cn(
            "flex items-center space-x-3 px-3 py-3 rounded-xl transition-all duration-200 touch-target",
            "hover:bg-primary-foreground/10 text-sm opacity-80"
          )}
        >
          <Smartphone className="h-4 w-4 flex-shrink-0" />
          {!collapsed && <span>Ver Catálogo</span>}
        </Link>
      </div>
    </div>
  );
};
