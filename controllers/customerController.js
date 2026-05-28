// controllers/customerController.js
const { User, Order, OrderItem, Product, Store, Wishlist } = require('../models');
const sequelize = require('../config/database');

// GET /customer/dashboard
const dashboard = async (req, res) => {
  try {
    const currentUserId = req.session.userId;
    const user = await User.findByPk(currentUserId);
    
    // Consultar órdenes forzando la columna real de tu base de datos
    const recentOrders = await Order.findAll({
      where: { user_id: currentUserId }, // Ajustado a user_id para evitar "Unknown column"
      include: [{ 
        model: OrderItem, 
        as: 'items',
        include: [{ model: Product, as: 'product' }] 
      }],
      //order: [['createdAt', 'DESC']], // Corregir 
      order: [sequelize.literal('`createdAt` DESC')],
      limit: 3
    });

    const wishlistItems = await Wishlist.findAll({
      where: { user_id: currentUserId }, // Ajustado a user_id para evitar "Unknown column"
      include: [{ 
        model: Product, 
        as: 'product',
        include: [{ model: Store, as: 'store' }] 
      }],
      limit: 4
    });

    res.render('customer/dashboard', { layout: false, user, recentOrders, wishlistItems });
  } catch (error) {
    console.error("Error en Dashboard de Cliente:", error);
    res.status(500).send("Error en el servidor: " + error.message);
  }
};

// GET /customer/orders
const listOrders = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    const orders = await Order.findAll({
      where: { user_id: req.session.userId },
      include: [{ 
        model: OrderItem, 
        as: 'items',
        include: [{ model: Product, as: 'product' }] 
      }],
      //order: [['createdAt', 'DESC']]
      order: [sequelize.literal('`createdAt` DESC')]
    });
    res.render('customer/orders', { layout: false, user, orders });
  } catch (error) {
    console.error("Error en listOrders:", error);
    res.status(500).send(error.message);
  }
};

// GET /customer/orders/:id
const orderDetail = async (req, res) => {
  try {
    const user  = await User.findByPk(req.session.userId);
    const order = await Order.findOne({
      where: { id: req.params.id, user_id: req.session.userId },
      include: [{ 
        model: OrderItem, 
        as: 'items',
        include: [
          { model: Product, as: 'product' },
          { model: Store,   as: 'store'   }
        ]
      }]
    });
    if (!order) return res.redirect('/customer/orders');
    res.render('customer/order-detail', { layout: false, user, order });
  } catch (error) {
    console.error("Error en orderDetail:", error);
    res.status(500).send(error.message);
  }
};

// GET /customer/wishlist
const wishlist = async (req, res) => {
  try {
    const items = await Wishlist.findAll({
      where: { user_id: req.session.userId },
      include: [{ 
        model: Product, 
        as: 'product',
        include: [{ model: Store, as: 'store' }] 
      }],
      order: [['createdAt', 'DESC']]
    });
    res.render('customer/wishlist', { layout: false, items });
  } catch (error) {
    console.error("Error en wishlist:", error);
    res.status(500).send(error.message);
  }
};

// POST /customer/wishlist/add/:productId
const addToWishlist = async (req, res) => {
  try {
    await Wishlist.findOrCreate({
      where: {
        user_id:    req.session.userId,
        product_id: req.params.productId
      }
    });
  } catch (e) { /* ignorar duplicado */ }
  const back = req.headers.referer || '/customer/wishlist';
  res.redirect(back);
};

// POST /customer/wishlist/remove/:productId
const removeFromWishlist = async (req, res) => {
  try {
    await Wishlist.destroy({
      where: {
        user_id:    req.session.userId,
        product_id: req.params.productId
      }
    });
    res.redirect('/customer/wishlist');
  } catch (error) {
    console.error("Error en removeFromWishlist:", error);
    res.status(500).send(error.message);
  }
};

module.exports = {
  dashboard, 
  listOrders, 
  orderDetail,
  wishlist, 
  addToWishlist, 
  removeFromWishlist
};