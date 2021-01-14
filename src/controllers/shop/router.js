/* eslint-disable func-names */
const express = require('express');
const api = require('./api');
const views = require('./views');
const { pay, beforePay } = require('../pay').api;

const router = express.Router();
const shop_router = express.Router({ mergeParams: true });
const { relogin, isAuthenticated } = require('../user/api');

/* GET home page. */
router.get('/new', isAuthenticated, views.renderCreateShop);

router.get('/dashboard', isAuthenticated, views.renderShopAdmin);

router.get('/dashboard/add-account', views.renderAddAccount);

router.put('/dashboard/update', api.updateShop);

// apis

router.post(
  '/new',
  api.createShop,
  relogin,
  api.prepareShopPayment,
  beforePay,
  pay
);

router.get('/dashboard/pay', views.renderShopPayment);

router.post('/dashboard/pay', api.prepareShopPayment, pay);

router.post('/dashboard/add-account', api.createSubaccount);

router.patch('/open', isAuthenticated, api.openShop);

/** SINGLE SHOP VIEWS ROUTER - THANK YOU JESUS */

shop_router.get('/products/:product_slug', views.renderProduct);

shop_router.get('/search', api.searchShop);

shop_router.get('/', views.renderShop);

module.exports = { main_router: router, shop_router };
