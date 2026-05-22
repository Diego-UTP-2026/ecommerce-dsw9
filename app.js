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

const app  = express();
const port = process.env.PORT || 3000;

// Import:
const userAuthRoutes = require('./routes/userAuth');
const userRoutes = require('./routes/userAuth');

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

// 3. Crear la ruta temporal para el Dashboard si el laboratorio te lo pide antes de tiempo:
app.get('/customer/dashboard', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/auth/user/login');
    }
    // Renderiza la vista del dashboard del cliente pasándole la sesión
    res.render('customer/dashboard', { title: 'Mi Panel' }); 
});

app.use('/',         productRoutes);
app.use('/cart',     cartRoutes);
app.use('/checkout', checkoutRoutes);
// Rutas — junto a los app.use() existentes:
app.use('/store', storeAuthRoutes);
// Ruta (junto a las demás):
app.use('/user', userAuthRoutes);
app.use('/auth/user', userRoutes);


app.use((req, res) => {
  res.status(404).render('404', { title: 'Pagina no encontrada' });
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