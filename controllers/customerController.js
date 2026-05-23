const { User, Order, OrderItem, Product, Store, Wishlist } = require('../models');
//const { Order, Product, Wishlist } = require('../models');

// GET /customer/dashboard
exports.dashboard = async (req, res) => {
    try {
        // ID del usuario logueado en la sesión de Express
        const currentUserId = req.session.userId; 

        // 1. Consultar órdenes forzando la columna real de tu base de datos (user_id)
        const orders = await Order.findAll({
            where: { 
                // Aquí cambiamos userId por 'user_id' para que coincida con tu BD en MySQL Workbench
                user_id: currentUserId 
            },
            include: [{ model: Product, as: 'Products' }], // O como esté tu relación de pertenencia
            order: [['createdAt', 'DESC']]
        });

        // 2. Consultar Wishlist del cliente
        const wishlistItems = await Wishlist.findAll({
            where: { user_id: currentUserId },
            include: [{ model: Product }]
        });

        // 3. Renderizar la vista oficial del Paso 16
        res.render('customer/dashboard', {
            title: 'Panel de Comprador',
            orders: orders,
            wishlist: wishlistItems,
            user: req.session.user
        });

    } catch (error) {
        console.error("Error al cargar el Dashboard de Cliente:", error);
        res.status(500).send("Error en el servidor: " + error.message);
    }
};
/*const dashboard = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    const recentOrders = await Order.findAll({
      where: { userId: req.session.userId }, // <-- CORREGIDO: userId
      include: [{ model: OrderItem, as: 'items',
        include: [{ model: Product, as: 'product' }] }],
      order: [['createdAt', 'DESC']],
      limit: 3
    });
    const wishlistItems = await Wishlist.findAll({
      where: { userId: req.session.userId }, // <-- CORREGIDO: userId
      include: [{ model: Product, as: 'product',
        include: [{ model: Store, as: 'store' }] }],
      limit: 4
    });
    res.render('customer/dashboard', { layout: false, user, recentOrders, wishlistItems });
  } catch (error) {
    console.error("Error en Dashboard:", error);
    res.status(500).send("Error en el servidor: " + error.message);
  }
};*/

// GET /customer/orders
const listOrders = async (req, res) => {
  try {
    const user = await User.findByPk(req.session.userId);
    const orders = await Order.findAll({
      where: { userId: req.session.userId }, // <-- CORREGIDO: userId
      include: [{ model: OrderItem, as: 'items',
        include: [{ model: Product, as: 'product' }] }],
      order: [['createdAt', 'DESC']]
    });
    res.render('customer/orders', { layout: false, user, orders });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// GET /customer/orders/:id
const orderDetail = async (req, res) => {
  try {
    const user  = await User.findByPk(req.session.userId);
    const order = await Order.findOne({
      where: { id: req.params.id, userId: req.session.userId }, // <-- CORREGIDO: userId
      include: [{ model: OrderItem, as: 'items',
        include: [
          { model: Product, as: 'product' },
          { model: Store,   as: 'store'   }
        ]
      }]
    });
    if (!order) return res.redirect('/customer/orders');
    res.render('customer/order-detail', { layout: false, user, order });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// GET /customer/wishlist
const wishlist = async (req, res) => {
  try {
    const items = await Wishlist.findAll({
      where: { userId: req.session.userId }, // <-- CORREGIDO: userId
      include: [{ model: Product, as: 'product',
        include: [{ model: Store, as: 'store' }] }],
      order: [['createdAt', 'DESC']]
    });
    res.render('customer/wishlist', { layout: false, items });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// POST /customer/wishlist/add/:productId
const addToWishlist = async (req, res) => {
  try {
    await Wishlist.findOrCreate({
      where: {
        userId:     req.session.userId, // <-- CORREGIDO: userId
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
        userId:     req.session.userId, // <-- CORREGIDO: userId
        product_id: req.params.productId
      }
    });
    res.redirect('/customer/wishlist');
  } catch (error) {
    res.status(500).send(error.message);
  }
};

module.exports = {
  dashboard, listOrders, orderDetail,
  wishlist, addToWishlist, removeFromWishlist
};