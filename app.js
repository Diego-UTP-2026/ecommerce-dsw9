// app.js — reemplaza el Hello World
require('dotenv').config();
const express      = require('express');
const path         = require('path');
const session      = require('express-session');
const cookieParser = require('cookie-parser');
const ejsLayouts   = require('express-ejs-layouts');
const sequelize    = require('./config/database');

// ── Rutas del e-commerce base ──────────────────────────────────
const { Product, Order, OrderItem } = require('./models');
const productRoutes  = require('./routes/products');
const cartRoutes     = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

// ── Rutas del marketplace ──────────────────────────────────────
const storeAuthRoutes = require('./routes/storeAuth');   // paso 13.4
const userAuthRoutes = require('./routes/userAuth');     // paso 14.2
const storeAdminRoutes = require('./routes/storeAdmin'); // paso 15.4
const customerRoutes = require('./routes/customer');     // paso 16.x

// ── Middleware ─────────────────────────────────────────────────
const { attachLocals } = require('./middleware/authMiddleware');

const app  = express();
const port = process.env.PORT || 3000;

// Configuración de vistas
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');        // usa views/layout.ejs como plantilla base
app.use(ejsLayouts);                // activa el sistema de layouts

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({
  secret:            process.env.SESSION_SECRET || 'dev-secret',
  resave:            false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000 }
}));

// Adjunta storeSession y userSession a res.locals
app.use(attachLocals);

// Middleware: carrito vacio en sesion si no existe
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = { items: [], totalQty: 0, totalPrice: 0 };
  }
  res.locals.cartItemCount = req.session.cart.totalQty || 0;
  next();
});

// ── Rutas ──────────────────────────────────────────────────────
app.use('/',              productRoutes);
app.use('/cart',          cartRoutes);
app.use('/checkout',      checkoutRoutes);
app.use('/store',         storeAuthRoutes);
app.use('/user',          userAuthRoutes); // Mapea a /user/login, /user/register, etc.
app.use('/store-admin',   storeAdminRoutes);
app.use('/customer',      customerRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('404', { title: 'Pagina no encontrada', layout: false });
});

sequelize.sync()
  .then(() => {
    console.log('Base de datos sincronizada');
    app.listen(port, () => {
      console.log(`Servidor en http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error al sincronizar BD:', err.message);
    process.exit(1);
  });

  app.use(['/store/login', '/store/register',
         '/user/login',  '/user/register',
         '/store-admin', '/customer'],
  (req, res, next) => { res.locals.layout = false; next(); }
);
