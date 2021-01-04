/* eslint-disable func-names */
const router = require('express').Router();
const api = require('./api');
const views = require('./views');
const { relogin, isAuthenticated } = require('../user/api');

/* GET home page. */
router.get('/new', isAuthenticated, views.renderCreateShop);

router.get('/:slug/admin', views.renderShopAdmin);

// apis

router.post('/new', api.createShop, relogin, api.collectShopPayment);

module.exports = router;
