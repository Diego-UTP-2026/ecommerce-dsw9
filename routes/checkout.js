// routes/checkout.js
const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');

router.get('/', checkoutController.getCheckoutPage);
router.post('/process', checkoutController.processCheckout);                  //rea orden BD + muestra PayPal
router.post('/create-paypal-order', checkoutController.createPayPalOrder);    // crea orden en PayPal API
router.post('/capture-paypal-order', checkoutController.capturePayPalOrder);  // captura el pago aprobado

// ¡ESTA LÍNEA ES LA QUE TE FALTABA CONECTAR!
router.get('/success', checkoutController.getSuccessPage); 

router.get('/cancel', checkoutController.handleCancelPayment);

module.exports = router;
