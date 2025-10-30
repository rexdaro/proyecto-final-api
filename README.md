# E-commerce API

API REST para un sistema de e-commerce

## Instalacion

```bash
npm install
```

## Configuracion

Crear archivo .env con:
```
PORT=3000
MONGO_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=miclavesecretsupersegura123
JWT_EXPIRES_IN=7d
```

## Iniciar

```bash
npm start
```

## Rutas

### Usuarios
- POST /api/users/register - Registrar usuario
- POST /api/users/login - Login
- GET /api/users - Listar usuarios (admin)
- GET /api/users/:id - Ver usuario
- DELETE /api/users/:id - Eliminar usuario (admin)

### Productos
- GET /api/productos - Listar productos
- GET /api/productos/filtro - Filtrar productos
- GET /api/productos/top - Top productos
- GET /api/productos/:id - Ver producto
- POST /api/productos - Crear producto (admin)
- PUT /api/productos/:id - Actualizar producto (admin)
- PATCH /api/productos/:id/stock - Actualizar stock (admin)
- DELETE /api/productos/:id - Eliminar producto (admin)

### Categorias
- GET /api/categorias - Listar categorias
- GET /api/categorias/stats - Stats de categorias
- GET /api/categorias/:id - Ver categoria
- POST /api/categorias - Crear categoria (admin)
- PUT /api/categorias/:id - Actualizar categoria (admin)
- DELETE /api/categorias/:id - Eliminar categoria (admin)

### Carrito
- GET /api/carrito/:usuarioId - Ver carrito
- GET /api/carrito/:usuarioId/total - Calcular total
- POST /api/carrito - Agregar al carrito
- DELETE /api/carrito/:usuarioId/producto/:productoId - Quitar del carrito

### Pedidos
- GET /api/ordenes - Listar pedidos
- GET /api/ordenes/stats - Stats de pedidos (admin)
- GET /api/ordenes/user/:userId - Pedidos de usuario
- GET /api/ordenes/:id - Ver pedido
- POST /api/ordenes - Crear pedido
- PATCH /api/ordenes/:id/status - Actualizar estado (admin)
- DELETE /api/ordenes/:id - Eliminar pedido (admin)

### Resenas
- GET /api/resenas - Listar resenas
- GET /api/resenas/product/:productId - Resenas de producto
- GET /api/resenas/top - Top resenas
- POST /api/resenas - Crear resena
- PUT /api/resenas/:id - Actualizar resena
- DELETE /api/resenas/:id - Eliminar resena



Estructura del proyecto:

Parcial Integrador – Bases de Datos 2/
├── config/
│   └── database.js           # Conexión a MongoDB
├── middleware/
│   └── auth.js               # JWT y verificación de rol
├── models/
│   ├── Usuario.js            # Con bcrypt para passwords
│   ├── Categoria.js
│   ├── Producto.js
│   ├── Carrito.js
│   ├── Pedido.js
│   └── Resena.js
├── routes/
│   ├── usuarios.js           # Login, register, CRUD
│   ├── productos.js          # CRUD + filtros + top + stock
│   ├── categorias.js         # CRUD + stats
│   ├── carrito.js            # CRUD + calcular total
│   ├── pedidos.js            # CRUD + stats + cambiar estado
│   └── resenas.js            # CRUD + validar compra
├── server.js                 # Servidor principal
├── seed.js                   # Script para datos de prueba
├── .env                      # Configuración
├── package.json
└── README.md