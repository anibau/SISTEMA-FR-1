# 🍺 Francachela POS - Sistema de Punto de Venta

Sistema moderno de gestión para licorería con interfaz táctil, gestión de inventario, clientes y reportes.

## 🚀 Características

- **POS Táctil**: Interfaz optimizada para tablets y pantallas táctiles
- **Gestión de Productos**: CRUD completo con códigos de barras
- **Sistema de Clientes**: Fidelización y puntos
- **Promociones**: Descuentos automáticos y combos
- **Reportes**: Métricas en tiempo real
- **Multitickets**: Múltiples ventas simultáneas
- **Métodos de Pago**: Efectivo, Yape, Plin, Transferencia
- **Modo Offline**: Funciona sin conexión con mocks

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **UI**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand + React Query
- **HTTP Client**: Axios
- **Routing**: React Router DOM
- **Icons**: Lucide React

## 📦 Instalación

```bash
# Clonar repositorio
git clone <repository-url>
cd francachela-pos-flow

# Instalar dependencias
npm install

# Configurar variables de entorno
cp env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env.local` basado en `env.example`:

```env
# Configuración de la API
VITE_API_URL=http://localhost:3000/api/v1

# Configuración de desarrollo
VITE_USE_MOCKS=true
VITE_DEBUG_MODE=true

# Configuración de la aplicación
VITE_APP_NAME=Francachela POS
```

### Modo Mocks

Para desarrollo sin backend, activa los mocks:

```env
VITE_USE_MOCKS=true
```

Los mocks incluyen:
- Productos de ejemplo (cervezas, piscos, vodkas, etc.)
- Clientes de prueba
- Promociones simuladas
- Ventas de ejemplo

### Conectar con Backend

Para usar con el backend real:

```env
VITE_USE_MOCKS=false
VITE_API_URL=http://localhost:3000/api/v1
```

## 🏗️ Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── ui/             # Componentes base (shadcn/ui)
│   ├── layout/         # Layout y navegación
│   └── pos/            # Componentes específicos del POS
├── hooks/              # Hooks personalizados
│   ├── useAuth.ts      # Autenticación
│   ├── useProducts.ts  # Gestión de productos
│   └── use-mobile.tsx  # Detección de móvil
├── pages/              # Páginas de la aplicación
│   ├── POS.tsx         # Punto de venta principal
│   ├── Dashboard.tsx   # Dashboard con métricas
│   ├── Inventory.tsx   # Gestión de inventario
│   └── ...
├── services/           # Servicios API
│   ├── api.ts          # Cliente HTTP base
│   ├── auth.service.ts # Autenticación
│   ├── products.service.ts # Productos
│   ├── customers.service.ts # Clientes
│   ├── sales.service.ts # Ventas
│   ├── promotions.service.ts # Promociones
│   └── mocks.ts        # Datos simulados
├── store/              # Estado global (Zustand)
│   ├── pos.store.ts    # Store del POS
│   └── pos.store.new.ts # Store actualizado con API
└── types/              # Tipos TypeScript
    └── pos.types.ts    # Tipos del sistema
```

## 🔧 Servicios API

### Cliente HTTP Base (`api.ts`)

- Interceptores para autenticación JWT
- Manejo global de errores
- Configuración de CORS
- Soporte para mocks

### Servicios Disponibles

1. **AuthService**: Login, logout, refresh token
2. **ProductsService**: CRUD productos, búsqueda, import/export
3. **CustomersService**: Gestión clientes, puntos, estadísticas
4. **SalesService**: Ventas, reportes, estadísticas
5. **PromotionsService**: Promociones, validación, aplicación

### Hooks React Query

- `useProducts()`: Lista y gestión de productos
- `useAuth()`: Autenticación y permisos
- `useCustomers()`: Gestión de clientes
- `useSales()`: Ventas y reportes

## 🎯 Funcionalidades del POS

### Búsqueda de Productos
- Por nombre
- Por código de barras
- Por categoría
- Filtros de precio y stock

### Gestión de Carrito
- Agregar/remover productos
- Modificar cantidades
- Validación de stock
- Cálculo automático de totales

### Clientes
- Búsqueda rápida
- Creación automática
- Sistema de puntos
- Historial de compras

### Métodos de Pago
- Efectivo
- Yape
- Plin
- Transferencia
- Tarjeta

### Multitickets
- Múltiples ventas simultáneas
- Guardar tickets pendientes
- Restaurar tickets eliminados

## 📱 Responsive Design

- Optimizado para tablets (768px+)
- Interfaz táctil
- Botones grandes para fácil uso
- Modo oscuro/claro

## 🚀 Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Build de producción
npm run build

# Preview de producción
npm run preview

# Linting
npm run lint
```

## 🔐 Autenticación

### Roles Disponibles
- **Admin**: Acceso completo
- **Vendedor**: Gestión de ventas e inventario
- **Cajero**: Solo procesar ventas

### Permisos
- Gestión de productos
- Gestión de usuarios
- Reportes
- Promociones
- Inventario
- Clientes

## 📊 Reportes

- Ventas diarias/mensuales
- Productos más vendidos
- Clientes top
- Stock bajo
- Métricas de rendimiento

## 🔄 Integración con Backend

El sistema está preparado para integrarse con el backend NestJS:

1. **Configurar URL de API** en `.env.local`
2. **Desactivar mocks** (`VITE_USE_MOCKS=false`)
3. **Configurar autenticación JWT**
4. **Sincronizar tipos** con el backend

## 🐛 Debugging

### Modo Debug
```env
VITE_DEBUG_MODE=true
```

### Logs de Desarrollo
- Errores de API en consola
- Estado de mocks
- Performance de queries

## 📝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte técnico:
- Revisar documentación de NestJS
- Consultar issues del repositorio
- Contactar al equipo de desarrollo

---

**¡Manos a la obra! 🚀**
*El sistema Francachela está listo para revolucionar tu licorería*
