
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppLayout } from "./components/layout/AppLayout";
import Index from "./pages/Index";
import POS from "./pages/POS";
import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import Customers from "./pages/Customers";
import Sales from "./pages/Sales";
import Promotions from "./pages/Promotions";
import Catalog from "./pages/Catalog";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Página pública del catálogo */}
          <Route path="/catalogo" element={<Catalog />} />
          
          {/* Rutas de la aplicación administrativa */}
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Index />} />
            <Route path="pos" element={<POS />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="inventario" element={<Inventory />} />
            <Route path="clientes" element={<Customers />} />
            <Route path="ventas" element={<Sales />} />
            <Route path="promociones" element={<Promotions />} />
          </Route>
          
          {/* Ruta catch-all para 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
