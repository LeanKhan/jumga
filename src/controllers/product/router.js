/* eslint-disable func-names */
const router = require('express').Router();

const api = require('./api');
const { pay } = require('../pay').api;

// get products
router.get('/', api.getProducts);

/* GET home page. */
// check if isAuthenticated, isAdmin, if the rider has been created before and all that. thank you Jesus!
router.post('/new', api.authorizeShopAdmin, api.addProduct);

router.post('/pay', api.prepareProductPayment, pay);

router.put('/:id/update', api.authorizeShopAdmin, api.updateProduct);

router.delete('/:id', api.authorizeShopAdmin, api.deleteProduct);

module.exports = router;
