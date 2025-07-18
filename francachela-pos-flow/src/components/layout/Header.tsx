
import { Button } from "@/components/ui/button";
import { Bell, Moon, Sun, User, Menu } from "lucide-react";
import { useState, useEffect } from "react";

interface HeaderProps {
  onToggleSidebar: () => void;
  sidebarCollapsed: boolean;
}

export const Header = ({ onToggleSidebar, sidebarCollapsed }: HeaderProps) => {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <header className="bg-card border-b border-border p-4 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        {/* Botón de toggle para móviles */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="md:hidden touch-target"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Bienvenido a Francachela
          </h2>
          <p className="text-sm text-muted-foreground">
            Sistema de punto de venta y administración
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        {/* Toggle modo oscuro */}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setDarkMode(!darkMode)}
          className="touch-target"
        >
          {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>

        {/* Notificaciones */}
        <Button variant="ghost" size="icon" className="touch-target relative">
          <Bell className="h-5 w-5" />
          <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
            3
          </span>
        </Button>

        {/* Perfil de usuario */}
        <Button variant="ghost" size="icon" className="touch-target">
          <User className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
