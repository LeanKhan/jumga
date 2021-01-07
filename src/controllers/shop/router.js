/* eslint-disable func-names */
const express = require('express');
const api = require('./api');
const views = require('./views');

const router = express.Router();
const shop_router = express.Router();
const { relogin, isAuthenticated } = require('../user/api');

/* GET home page. */
router.get('/new', isAuthenticated, views.renderCreateShop);

router.get('/dashboard', isAuthenticated, views.renderShopAdmin);

router.get('/dashboard/add-account', views.renderAddAccount);

// apis

router.post('/new', api.createShop, relogin, api.collectShopPayment);

router.post('/dashboard/add-account', api.createSubaccount);

router.patch('/open', isAuthenticated, api.openShop);

/** SHOP ROUTER VIEWS */
shop_router.get('/:slug', views.renderShop);

module.exports = { main_router: router, shop_router };
