const express = require('express');
const { getPayments, getPaymentById, removePayment, paymentFulfillment, paymentUpdate } = require('../controllers/PaymentController/paymentController');
const { uploadFile } = require('../middlewares/uploadFile');
const authentication = require('../middlewares/authentication');
const adminAuthorization = require('../middlewares/adminAuthorization');
const router = express.Router();

router.get('/', getPayments);
router.get('/:id', getPaymentById);

router.use(authentication);
router.post('/fulfillment', uploadFile('pembayaran_pertama'), paymentFulfillment);

router.use(adminAuthorization);
router.put('/update/:id', paymentUpdate);
router.delete('/delete/:id', removePayment);

module.exports = router;
