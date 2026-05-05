// app.js — reemplaza el Hello World
require('dotenv').config();
const express      = require('express');
const path         = require('path');
const session      = require('express-session');
const cookieParser = require('cookie-parser');
const ejsLayouts   = require('express-ejs-layouts');
const sequelize    = require('./config/database');
// const { Product, Order, OrderItem } = require('./models');

const productRoutes  = require('./routes/products');
const cartRoutes     = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

const app  = express();
const port = process.env.PORT || 3000;

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

//---------------------------------------------------------------

// app.js — version Hello World
/*require('dotenv').config();
const express = require('express');
const app     = express();
const port    = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <h1>Hello World - DIEGO LUIS CORDOBA LOZANO</h1>
    <p>La aplicacion funciona en Render.</p>
    <p>Puerto: ${port} | Entorno: ${process.env.NODE_ENV || 'development'}</p>
  `);
});

app.listen(port, () => {
  console.log(`Servidor corriendo en puerto ${port}`);
});*/