// controllers/storeAdminController.js  (1/3) — Dashboard y listado
const { Store, Product, Order, OrderItem } = require('../models');
const { Op } = require('sequelize');

// GET /store-admin/dashboard
const dashboard = async (req, res) => {
  const storeId = req.session.storeId;
  const store   = await Store.findByPk(storeId);

  // Ventas del mes actual
  const now        = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const items = await OrderItem.findAll({
    where: { store_id: storeId, createdAt: { [Op.gte]: monthStart } },
    include: [{ model: Order, as: 'order' }]
  });
  const monthSales  = items.reduce((s, i) => s + parseFloat(i.price) * i.quantity, 0);
  const orderCount  = new Set(items.map(i => i.order_id)).size;
  const productCount= await Product.count({ where: { store_id: storeId } });

  res.render('store-admin/dashboard', { layout: false,
    store, monthSales: monthSales.toFixed(2), orderCount, productCount
  });
};

// GET /store-admin/products
const listProducts = async (req, res) => {
  const products = await Product.findAll({
    where: { store_id: req.session.storeId },
    order: [['createdAt', 'DESC']]
  });
  res.render('store-admin/products', { layout: false, products });
};

// controllers/storeAdminController.js  (2/3) — CRUD productos
const showNewProduct = (req, res) =>
  res.render('store-admin/product-form', { layout: false, product: null, error: null });

const createProduct = async (req, res) => {
  const { name, description, price, stock, imageUrl } = req.body;
  try {
    await Product.create({
      name, description, price, stock: stock || 0,
      imageUrl: imageUrl || '/images/placeholder.png',
      store_id: req.session.storeId
    });
    res.redirect('/store-admin/products');
  } catch (err) {
    res.render('store-admin/product-form', { layout: false, product: null, error: 'Error al crear el producto.' });
  }
};

const showEditProduct = async (req, res) => {
  const product = await Product.findOne({
    where: { id: req.params.id, store_id: req.session.storeId }
  });
  if (!product) return res.redirect('/store-admin/products');
  res.render('store-admin/product-form', { layout: false, product, error: null });
};

const updateProduct = async (req, res) => {
  const { name, description, price, stock, imageUrl } = req.body;
  await Product.update(
    { name, description, price, stock, imageUrl },
    { where: { id: req.params.id, store_id: req.session.storeId } }
  );
  res.redirect('/store-admin/products');
};

const deleteProduct = async (req, res) => {
  await Product.destroy({
    where: { id: req.params.id, store_id: req.session.storeId }
  });
  res.redirect('/store-admin/products');
};

// controllers/storeAdminController.js  (3/3) — Ventas y settings
//const { sequelize } = require('../config/database');

// GET /store-admin/orders
const listOrders = async (req, res) => {
  const items = await OrderItem.findAll({
    where: { store_id: req.session.storeId },
    include: [
      { model: Order,   as: 'order'   },
      { model: Product, as: 'product' }
    ],
    order: [['createdAt', 'DESC']],
    limit: 50
  });
  // Agrupar items por orden
  const ordersMap = {};
  items.forEach(item => {
    const oid = item.order_id;
    if (!ordersMap[oid]) ordersMap[oid] = { order: item.order, items: [] };
    ordersMap[oid].items.push(item);
  });
  const orders = Object.values(ordersMap);
  res.render('store-admin/orders', { layout: false, orders });
};

// GET /store-admin/settings
const showSettings = async (req, res) => {
  const store = await Store.findByPk(req.session.storeId);
  res.render('store-admin/settings', { layout: false, store, success: null, error: null });
};

// POST /store-admin/settings (actualizar paypal_email y datos de tienda)
const updateSettings = async (req, res) => {
  try {
    const { name, description, paypal_email } = req.body;
    const storeId = req.session.storeId;

    // 1. Actualizar en la base de datos de Aiven usando snake_case
    await Store.update(
      { name, description, paypal_email },
      { where: { id: storeId } }
    );

    // 2. Recuperar el registro actualizado desde la base de datos
    const updatedStore = await Store.findByPk(storeId);

    // 3. 🌟 PASO CLAVE: Sincronizar la sesión de Express con los nuevos datos
    req.session.store = updatedStore;

    // 4. Guardar explícitamente en la sesión y renderizar la vista con la variable 'page' para el menú
    req.session.save((err) => {
      if (err) {
        console.error("Error al guardar la sesión:", err);
        return res.render('store-admin/settings', { 
          layout: false, 
          store: updatedStore, 
          page: 'settings', 
          success: null, 
          error: 'Error al actualizar la sesión.' 
        });
      }

      res.render('store-admin/settings', { 
        layout: false, 
        store: updatedStore, 
        page: 'settings', // Le pasamos la página actual para que el sidebar se pinte 'active'
        success: 'Configuración actualizada con éxito.', 
        error: null 
      });
    });

  } catch (error) {
    console.error("Error en updateSettings:", error);
    // Recuperar los datos actuales para no romper la vista en caso de error de base de datos
    const currentStore = await Store.findByPk(req.session.storeId);
    res.render('store-admin/settings', { 
      layout: false, 
      store: currentStore, 
      page: 'settings', 
      success: null, 
      error: 'Ocurrió un error en el servidor: ' + error.message 
    });
  }
};

/*const updateSettings = async (req, res) => {
  const { name, description, paypal_email } = req.body;
  await Store.update(
    { name, description, paypal_email },
    { where: { id: req.session.storeId } }
  );
  const store = await Store.findByPk(req.session.storeId);
  res.render('store-admin/settings', { layout: false, store, success: 'Configuracion actualizada.', error: null });
};*/

module.exports = {
  dashboard, listProducts, showNewProduct, createProduct,
  showEditProduct, updateProduct, deleteProduct,
  listOrders, showSettings, updateSettings
};