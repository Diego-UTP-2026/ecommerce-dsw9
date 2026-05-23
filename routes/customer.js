const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/customerController');

// 1. Importamos el módulo de autenticación completo para evitar desajustes de nombres
const authMiddleware = require('../middleware/authMiddleware');

// 2. Buscamos dinámicamente cuál de los dos nombres definiste en tu laboratorio
const middlewareSeguridad = authMiddleware.requireUserAuth || authMiddleware.requireUser;

// 3. Verificación de seguridad preventiva: si por alguna razón no existe, usamos un respaldo
if (!middlewareSeguridad) {
    console.error("CRÍTICO: No se encontró el middleware de autenticación de usuario.");
}

// 4. Aplicar el middleware a todas las rutas del cliente (Línea 8 corregida)
router.use(middlewareSeguridad);

// 5. Mapeo de rutas oficiales del Paso 16
router.get( '/dashboard',                   ctrl.dashboard);
router.get( '/orders',                      ctrl.listOrders);
router.get( '/orders/:id',                  ctrl.orderDetail);
router.get( '/wishlist',                    ctrl.wishlist);
router.post('/wishlist/add/:productId',     ctrl.addToWishlist);
router.post('/wishlist/remove/:productId',  ctrl.removeFromWishlist);

module.exports = router;