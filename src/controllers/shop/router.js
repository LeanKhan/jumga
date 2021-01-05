/* eslint-disable func-names */
const router = require('express').Router();
const api = require('./api');
const views = require('./views');
const { relogin, isAuthenticated } = require('../user/api');

/* GET home page. */
router.get('/new', isAuthenticated, views.renderCreateShop);

router.get('/admin', isAuthenticated, views.renderShopAdmin);

router.get('/admin/add-account', views.renderAddAccount);

// apis

router.post('/new', api.createShop, relogin, api.collectShopPayment);

router.post('/admin/add-account', api.createSubaccount);

module.exports = router;
