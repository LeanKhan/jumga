/* eslint-disable func-names */
const router = require('express').Router();
const { api, views } = require('../controllers/shop');

/* GET home page. */
router.get('/new', views.renderCreateShop);

router.get('/admin', views.renderShopAdmin);

// apis

router.post('/new', api.createShop, api.collectShopPayment);

module.exports = router;
