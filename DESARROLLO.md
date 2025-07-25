# 🚀 GUÍA DE DESARROLLO - SISTEMA FRANCACHELA

## 📋 PASOS PARA COMPLETAR EL DESARROLLO

### **PASO 1: CONFIGURACIÓN INICIAL**

#### 1.1 Instalar dependencias del backend
```bash
cd BackendFR
npm install
```

#### 1.2 Configurar variables de entorno
```bash
# Copiar archivo de ejemplo
cp env.example .env

# Editar .env con tus credenciales
# Especialmente importante:
# - DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE
# - JWT_SECRET (generar una clave segura)
# - TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN (para WhatsApp)
```

#### 1.3 Crear base de datos PostgreSQL
```sql
-- Conectar a PostgreSQL
psql -U postgres

-- Crear base de datos
CREATE DATABASE francachela_db;

#### 1.4 Instalar dependencias del frontend
```bash
cd francachela-liquor-hub
npm install
```

### **PASO 2: DESARROLLAR MÓDULOS DEL BACKEND**

#### 2.1 Módulo de Autenticación (Auth)
**Archivos a crear:**
- `src/modules/auth/auth.module.ts`
- `src/modules/auth/auth.controller.ts`
- `src/modules/auth/auth.service.ts`
- `src/modules/auth/guards/jwt-auth.guard.ts`
- `src/modules/auth/strategies/jwt.strategy.ts`
- `src/modules/auth/dto/login.dto.ts`
- `src/modules/auth/dto/register.dto.ts`

**Endpoints:**
- `POST /auth/login` - Login
- `POST /auth/refresh` - Renovar token
- `POST /auth/logout` - Logout
- `GET /auth/profile` - Perfil del usuario

#### 2.2 Módulo de Usuarios (Users)
**Archivos a crear:**
- `src/modules/users/users.module.ts`
- `src/modules/users/users.controller.ts`
- `src/modules/users/users.service.ts`
- `src/modules/users/entities/user.entity.ts`
- `src/modules/users/dto/create-user.dto.ts`
- `src/modules/users/dto/update-user.dto.ts`

**Endpoints:**
- `GET /users` - Listar usuarios
- `POST /users` - Crear usuario
- `PUT /users/:id` - Actualizar usuario
- `DELETE /users/:id` - Eliminar usuario

#### 2.3 Módulo de Productos (Products)
**Archivos a crear:**
- `src/modules/products/products.module.ts`
- `src/modules/products/products.controller.ts`
- `src/modules/products/products.service.ts`
- `src/modules/products/entities/product.entity.ts`
- `src/modules/products/dto/create-product.dto.ts`
- `src/modules/products/dto/update-product.dto.ts`
- `src/modules/products/dto/import-products.dto.ts`

**Endpoints:**
- `GET /products` - Listar productos
- `POST /products` - Crear producto
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto
- `POST /products/import` - Importar desde Excel
- `GET /products/export` - Exportar a Excel
- `GET /products/low-stock` - Productos con stock bajo

#### 2.4 Módulo de Ventas (Sales)
**Archivos a crear:**
- `src/modules/sales/sales.module.ts`
- `src/modules/sales/sales.controller.ts`
- `src/modules/sales/sales.service.ts`
- `src/modules/sales/entities/sale.entity.ts`
- `src/modules/sales/entities/sale-item.entity.ts`
- `src/modules/sales/dto/create-sale.dto.ts`
- `src/modules/sales/dto/complete-sale.dto.ts`

**Endpoints:**
- `POST /sales` - Crear venta
- `GET /sales` - Listar ventas
- `GET /sales/:id` - Obtener venta
- `POST /sales/:id/complete` - Completar venta
- `GET /sales/reports/daily` - Reporte diario
- `GET /sales/reports/monthly` - Reporte mensual

#### 2.5 Módulo de Clientes (Customers)
**Archivos a crear:**
- `src/modules/customers/customers.module.ts`
- `src/modules/customers/customers.controller.ts`
- `src/modules/customers/customers.service.ts`
- `src/modules/customers/entities/customer.entity.ts`
- `src/modules/customers/dto/create-customer.dto.ts`
- `src/modules/customers/dto/update-customer.dto.ts`

**Endpoints:**
- `GET /customers` - Listar clientes
- `POST /customers` - Crear cliente
- `PUT /customers/:id` - Actualizar cliente
- `DELETE /customers/:id` - Eliminar cliente
- `GET /customers/:id/points` - Puntos del cliente
- `GET /customers/top` - Clientes top

### **PASO 3: DESARROLLAR COMPONENTES DEL FRONTEND**

#### 3.1 Servicios API
**Archivos a crear:**
- `src/services/api.ts` - Cliente HTTP base
- `src/services/auth.service.ts` - Servicio de autenticación
- `src/services/products.service.ts` - Servicio de productos
- `src/services/sales.service.ts` - Servicio de ventas
- `src/services/customers.service.ts` - Servicio de clientes

#### 3.2 Hooks personalizados
**Archivos a crear:**
- `src/hooks/useAuth.ts` - Hook de autenticación
- `src/hooks/useProducts.ts` - Hook de productos
- `src/hooks/useSales.ts` - Hook de ventas
- `src/hooks/useCustomers.ts` - Hook de clientes
- `src/hooks/useInventory.ts` - Hook de inventario

#### 3.3 Tipos TypeScript
**Archivos a crear:**
- `src/types/auth.types.ts` - Tipos de autenticación
- `src/types/product.types.ts` - Tipos de productos
- `src/types/sale.types.ts` - Tipos de ventas
- `src/types/customer.types.ts` - Tipos de clientes
- `src/types/common.types.ts` - Tipos comunes

#### 3.4 Componentes principales
**Archivos a crear:**
- `src/components/ProductCard.tsx` - Tarjeta de producto
- `src/components/ProductForm.tsx` - Formulario de producto
- `src/components/POSInterface.tsx` - Interfaz POS
- `src/components/CustomerForm.tsx` - Formulario de cliente
- `src/components/SalesChart.tsx` - Gráfico de ventas
- `src/components/InventoryTable.tsx` - Tabla de inventario

### **PASO 4: IMPLEMENTAR FUNCIONALIDADES ESPECÍFICAS**

#### 4.1 Sistema POS (Punto de Venta)
**Características a implementar:**
- Búsqueda rápida por código de barras
- Agregado de productos al carrito
- Cálculo automático de totales
- Aplicación de promociones
- Múltiples métodos de pago
- Impresión de tickets
- Modo oscuro/claro

**Archivos a crear:**
- `src/pages/POS.tsx` - Página principal del POS
- `src/components/pos/ProductSearch.tsx` - Búsqueda de productos
- `src/components/pos/Cart.tsx` - Carrito de compras
- `src/components/pos/PaymentModal.tsx` - Modal de pago
- `src/components/pos/TicketPrinter.tsx` - Impresión de tickets

#### 4.2 Gestión de Inventario
**Funcionalidades a implementar:**
- Control de stock en tiempo real
- Alertas de stock mínimo
- Movimientos de inventario
- Ajustes de inventario
- Reportes de stock

**Archivos a crear:**
- `src/pages/Inventory.tsx` - Página de inventario
- `src/components/inventory/StockTable.tsx` - Tabla de stock
- `src/components/inventory/StockAdjustment.tsx` - Ajuste de stock
- `src/components/inventory/MovementHistory.tsx` - Historial de movimientos

#### 4.3 Sistema de Promociones
**Tipos de promociones a implementar:**
- Descuentos por porcentaje
- Descuentos por cantidad (3x2)
- Combos de productos
- Promociones por fecha

**Archivos a crear:**
- `src/pages/Promotions.tsx` - Página de promociones
- `src/components/promotions/PromotionCard.tsx` - Tarjeta de promoción
- `src/components/promotions/PromotionForm.tsx` - Formulario de promoción
- `src/components/promotions/ComboBuilder.tsx` - Constructor de combos

### **PASO 5: INTEGRACIÓN CON WHATSAPP**

#### 5.1 Configuración de Twilio
**Pasos:**
1. Crear cuenta en Twilio
2. Obtener Account SID y Auth Token
3. Configurar número de WhatsApp Business
4. Configurar webhook para recibir mensajes

#### 5.2 Módulo WhatsApp
**Archivos a crear:**
- `src/modules/whatsapp/whatsapp.module.ts`
- `src/modules/whatsapp/whatsapp.controller.ts`
- `src/modules/whatsapp/whatsapp.service.ts`
- `src/modules/whatsapp/entities/whatsapp-message.entity.ts`

**Funcionalidades:**
- Bot automático de respuestas
- Catálogo por WhatsApp
- Consulta de puntos
- Pedidos por WhatsApp
- Notificaciones automáticas

### **PASO 6: SISTEMA DE REPORTES**

#### 6.1 Dashboard Principal
**Métricas a mostrar:**
- Ventas del día/semana/mes
- Productos más vendidos
- Clientes top
- Ganancias netas
- Stock bajo
- Promociones activas

**Archivos a crear:**
- `src/pages/Dashboard.tsx` - Dashboard principal
- `src/components/dashboard/SalesMetrics.tsx` - Métricas de ventas
- `src/components/dashboard/TopProducts.tsx` - Productos top
- `src/components/dashboard/TopCustomers.tsx` - Clientes top
- `src/components/dashboard/StockAlerts.tsx` - Alertas de stock

#### 6.2 Reportes Detallados
**Tipos de reportes:**
- Reporte de ventas
- Reporte de inventario
- Reporte de clientes
- Reporte de gastos
- Reporte de fiados

**Archivos a crear:**
- `src/pages/Reports.tsx` - Página de reportes
- `src/components/reports/SalesReport.tsx` - Reporte de ventas
- `src/components/reports/InventoryReport.tsx` - Reporte de inventario
- `src/components/reports/CustomerReport.tsx` - Reporte de clientes

### **PASO 7: SISTEMA DE FIDELIZACIÓN**

#### 7.1 Gestión de Puntos
**Funcionalidades:**
- Acumulación automática
- Canje de puntos
- Promociones especiales
- Ranking de clientes

**Archivos a crear:**
- `src/pages/Loyalty.tsx` - Página de fidelización
- `src/components/loyalty/PointsCard.tsx` - Tarjeta de puntos
- `src/components/loyalty/PointsHistory.tsx` - Historial de puntos
- `src/components/loyalty/RewardsCatalog.tsx` - Catálogo de recompensas

### **PASO 8: SEGURIDAD Y AUDITORÍA**

#### 8.1 Autenticación y Autorización
**Características:**
- JWT tokens
- Roles y permisos
- Sesiones seguras
- Logout automático

#### 8.2 Auditoría
**Logs a registrar:**
- Acciones de usuarios
- Cambios en productos
- Ventas y transacciones
- Accesos al sistema

**Archivos a crear:**
- `src/modules/audit/audit.module.ts`
- `src/modules/audit/audit.service.ts`
- `src/modules/audit/entities/audit-log.entity.ts`
- `src/pages/Audit.tsx` - Página de auditoría

### **PASO 9: BACKUP Y MANTENIMIENTO**

#### 9.1 Backups Automáticos
**Estrategia:**
- Backups diarios a Google Drive
- Exportación a Excel/CSV
- Backup manual disponible

**Archivos a crear:**
- `src/modules/backup/backup.module.ts`
- `src/modules/backup/backup.service.ts`
- `src/modules/backup/backup.controller.ts`

#### 9.2 Mantenimiento
**Tareas automáticas:**
- Limpieza de logs antiguos
- Optimización de base de datos
- Verificación de integridad

### **PASO 10: TESTING Y DEPLOYMENT**

#### 10.1 Testing
**Tipos de pruebas:**
- Pruebas unitarias
- Pruebas de integración
- Pruebas end-to-end

**Archivos a crear:**
- `src/**/*.spec.ts` - Pruebas unitarias
- `test/**/*.e2e-spec.ts` - Pruebas e2e

#### 10.2 Deployment
**Configuración de producción:**
- Variables de entorno de producción
- Configuración de base de datos
- Configuración de servidor web
- Configuración de SSL

## 🛠️ COMANDOS ÚTILES

### Backend
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run start:dev

# Ejecutar migraciones
npm run migration:run

# Ejecutar seeds
npm run seed

# Ejecutar tests
npm run test

# Build para producción
npm run build
```

### Frontend
```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Preview de producción
npm run preview
```

### Base de Datos
```sql
-- Conectar a PostgreSQL
psql -U postgres -d francachela_db

-- Ver tablas
\dt

-- Ver estructura de tabla
\d table_name

-- Ejecutar migración
\i migration_file.sql
```

## 📊 MÉTRICAS DE PROGRESO

### Backend (0/15 módulos)
- [ ] Auth Module
- [ ] Users Module
- [ ] Products Module
- [ ] Categories Module
- [ ] Sales Module
- [ ] Customers Module
- [ ] Promotions Module
- [ ] Inventory Module
- [ ] Reports Module
- [ ] Expenses Module
- [ ] Delivery Module
- [ ] Loyalty Module
- [ ] Audit Module
- [ ] WhatsApp Module
- [ ] Backup Module

### Frontend (3/12 páginas)
- [x] Dashboard
- [x] POS (básico)
- [x] Productos (básico)
- [ ] Clientes
- [ ] Promociones
- [ ] Reportes
- [ ] Fiados
- [ ] Gastos
- [ ] Delivery
- [ ] Fidelización
- [ ] Auditoría
- [ ] Configuración

### Funcionalidades Críticas
- [ ] Autenticación JWT
- [ ] CRUD de productos
- [ ] Sistema POS completo
- [ ] Gestión de clientes
- [ ] Sistema de promociones
- [ ] Reportes y métricas
- [ ] Integración WhatsApp
- [ ] Sistema de puntos
- [ ] Backups automáticos

## 🎯 PRÓXIMOS PASOS INMEDIATOS

1. **Completar módulo de autenticación** - Base para todo el sistema
2. **Desarrollar CRUD de productos** - Funcionalidad core
3. **Implementar sistema POS** - Interfaz principal de ventas
4. **Conectar frontend con backend** - Integración de APIs
5. **Desarrollar gestión de clientes** - Base para fidelización
6. **Implementar reportes básicos** - Métricas del negocio

## 📞 SOPORTE

Para consultas técnicas durante el desarrollo:
- Revisar documentación de NestJS: https://docs.nestjs.com/
- Revisar documentación de React: https://react.dev/
- Consultar TypeORM docs: https://typeorm.io/
- Revisar shadcn/ui docs: https://ui.shadcn.com/

---

**¡Manos a la obra! 🚀**
*El sistema Francachela está listo para ser desarrollado* 

**PROMPT BACKEND**
Genera el backend completo de una aplicación desacoplada para el sistema Francachela - Tu tienda de licores.

🎯 OBJETIVO:
Implementar una API RESTful completa y modular usando NestJS y PostgreSQL (con TypeORM), con autenticación JWT, organización por módulos funcionales, y todas las funcionalidades necesarias para gestionar una licorería moderna con POS táctil, delivery vía WhatsApp, promociones, multitickets y fidelización de clientes.

🧱 TECNOLOGÍAS:
- NestJS (con estructura modular por dominio)
- PostgreSQL (via TypeORM)
- Autenticación JWT
- Swagger para documentación
- Webhooks internos
- Tests unitarios y e2e (mínimos en módulos clave)
- Configuraciones dinámicas almacenadas en BD
- CORS habilitado
- Conexión externa habilitada para frontend React

🗂️ MÓDULOS PRINCIPALES (separar cada uno como carpeta):

1. **auth**
   - Registro/Login con email y contraseña
   - JWT para autenticación
   - Roles: administrador, vendedor
   - Middleware `RolesGuard`
   - Logs de acceso y acciones sensibles

2. **usuarios**
   - CRUD de usuarios
   - Roles y permisos
   - Bitácora de acciones críticas

3. **productos**
   - CRUD de productos
   - Flags: bonificado, habilita puntos
   - Historial de cambios
   - Búsqueda por nombre, código, categoría
   - Carga masiva vía Excel
   - Exportación a Excel

4. **combos**
   - CRUD de combos (paquetes de productos)
   - Descuento automático del stock individual

5. **promociones**
   - Reglas por cantidad, monto, cumpleaños
   - Válidas por rango de fechas
   - Activación/desactivación dinámica
   - Promos aplicables en POS y WhatsApp

6. **ventas**
   - Múltiples tickets activos por vendedor (multiticket persistente)
   - CRUD de ventas
   - Agregado por código, búsqueda
   - Métodos de pago: efectivo, Yape, Plin, transferencia
   - Registro de productos, promociones, cliente, puntos
   - Tickets exportables

7. **cierres-caja**
   - Registro por turno
   - Cálculo automático de totales, diferencias
   - Historial y exportación

8. **gastos**
   - Registro por categoría (servicios, transporte, etc.)
   - Exportación

9. **clientes**
   - Registro con validación por WhatsApp/DNI
   - Puntos por compra
   - Registro de fiados y pagos parciales
   - Ranking por puntos o ventas

10. **puntos**
    - Configuración dinámica (puntos por monto)
    - Cálculo automático
    - Consulta individual por número

11. **delivery**
    - Flujo de pedido: preparación → en camino → entregado
    - Pedido por WhatsApp
    - Relación con venta en POS

12. **catalogo**
    - Endpoint público para catálogo
    - Filtros: destacados, combos
    - SEO básico

13. **notificaciones**
    - API para alertas internas (stock bajo, fiado vencido, cumpleaños)
    - Envío de notificaciones por usuario (solo back por ahora)

14. **webhooks**
    - Eventos POST internos (ej. venta realizada, cliente registrado)
    - Diseñado para integraciones futuras (Twilio, Google Drive)

15. **configuraciones**
    - Configuraciones globales editables desde backend (puntos por S/, promociones activas, etc.)
    - CRUD y cache en memoria

16. **auditoria**
    - Bitácora de cambios: precios, stock, promociones, usuarios
    - Logs accesos y acciones

17. **documentacion**
    - Swagger generado automáticamente (`/docs`)
    - Endpoints públicos y protegidos visibles

18. **tests**
    - Mínimos unitarios para servicios clave (`ventas`, `productos`)
    - Pruebas e2e base en `auth` y `ventas`

📦 ESTRUCTURA:
- Proyecto NestJS modular (estructura limpia, por dominio)
- Separar DTOs, services, controllers y entidades
- Swagger con tags por módulo
- Middleware para logs, validaciones globales
- Pipes para validaciones comunes
- Guards para roles
- Entidades sincronizadas y migraciones incluidas
- Soporte para entorno `.env`

🌍 CONEXIONES Y CONSIDERACIONES:
- Permitir conexión desde frontend externo (React, origin configurable)
- Puerto 3000 por defecto
- Preparado para conexión futura con Supabase o Twilio

🔒 SEGURIDAD:
- Control por rol en rutas
- Protección de endpoints sensibles
- Validación de datos y sanitización

📁 ENTREGABLE:
- Backend NestJS completo, modularizado, con todos los endpoints y carpetas necesarias para funcionalidad total.
- Endpoints funcionales y conectables con frontend desacoplado.

