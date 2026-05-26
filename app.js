// app.js — reemplaza el Hello World
require('dotenv').config();
const express      = require('express');
const path         = require('path');
const session      = require('express-session');
const cookieParser = require('cookie-parser');
const ejsLayouts   = require('express-ejs-layouts');
const sequelize    = require('./config/database');
const { Product, Order, OrderItem } = require('./models');
const productRoutes  = require('./routes/products');

const cartRoutes     = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

// Imports — junto a los require existentes:
const storeAuthRoutes = require('./routes/storeAuth');
const { attachLocals } = require('./middleware/authMiddleware');

const storeAdminRoutes = require('./routes/storeAdmin');
const customerRoutes = require('./routes/customer');

const app  = express();
const port = process.env.PORT || 3000;

// Import:
const userAuthRoutes = require('./routes/userAuth');
//const userRoutes = require('./routes/userAuth');

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

// Después de app.use(session(...)):
app.use(attachLocals);

// Las vistas de auth y admin tienen su propio HTML completo con admin.css
// y NO deben pasar por layout.ejs. Este middleware lo desactiva para esas rutas.
app.use(['/store/login', '/store/register',
         '/user/login',  '/user/register',
         '/store-admin', '/customer'],
  (req, res, next) => { res.locals.layout = false; next(); }
);

// Middleware: carrito vacio en sesion si no existe
app.use((req, res, next) => {
  if (!req.session.cart) {
    req.session.cart = { items: [], totalQty: 0, totalPrice: 0 };
  }
  res.locals.cartItemCount = req.session.cart.totalQty || 0;
  next();
});

//*app.get('/', (req, res) => {
  /*res.send(`
    Hello World - DIEGO LUIS CÓRDOBA LOZANO
    La aplicacion funciona en Render.
    Puerto: ${port} | Entorno: ${process.env.NODE_ENV || 'development'}
  `);*/
//});

// Crear la ruta temporal para el Dashboard si el laboratorio te lo pide antes de tiempo:
/*app.get('/customer/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/auth/user/login');
    }
    // Renderiza la vista del dashboard del cliente pasándole la sesión
    res.render('customer/dashboard', { title: 'Mi Panel' }); 
});*/


// Dashboard del Cliente protegido
/*app.get('/customer/dashboard', (req, res) => {
    // Si usaste req.session.userId en tu controlador:
    if (!req.session.userId) {
        return res.redirect('/user/login'); // Redirige a tu ruta real de login
    }
    
    // Forzamos el layout falso si el dashboard maneja su propia plantilla completa (como el panel admin)
    res.render('customer/dashboard', { 
        title: 'Mi Panel', 
        layout: false // Cambiar a true si usa la barra de navegación común de la tienda
    }); 
});*/

// Reemplaza tu app.get('/customer/dashboard', ...) actual por este:
/*app.get('/customer/dashboard', (req, res) => {
    // 1. Verificación estricta de la sesión del usuario comprador
    if (!req.session || !req.session.userId) {
        return res.redirect('/user/login'); 
    }

    // 2. Renderizado preventivo pasando variables por si la vista las pide
    res.render('customer/dashboard', { 
        title: 'Panel de Cliente',
        user: req.session.user || { name: 'Karina Pardo' }, // Evita errores si la vista lee user.name
        layout: false // Fuerza a que no use el layout base si es un panel independiente
    }); 
});*/

/*app.use('/',         productRoutes);
app.use('/cart',     cartRoutes);
app.use('/checkout', checkoutRoutes);
// Rutas — junto a los app.use() existentes:
app.use('/store', storeAuthRoutes);
// Ruta (junto a las demás):
app.use('/user', userAuthRoutes);
//app.use('/auth/user', userRoutes);*/

// --- RUTAS DEL SISTEMA ---
app.use('/',         productRoutes);
app.use('/cart',     cartRoutes);
app.use('/checkout', checkoutRoutes);
app.use('/store',    storeAuthRoutes);
app.use('/user',     userAuthRoutes); // Mapea a /user/login, /user/register, etc.
app.use('/store-admin', storeAdminRoutes);
app.use('/customer', customerRoutes);

/*app.use((req, res) => {
  res.status(404).render('404', { title: 'Pagina no encontrada' });
});*/

// --- MANEJADOR 404 ---
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

  /*app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});*/