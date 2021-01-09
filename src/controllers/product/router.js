/* eslint-disable func-names */
const router = require('express').Router();

const api = require('./api');
const { pay } = require('../pay').api;

/* GET home page. */
// check if isAuthenticated, isAdmin, if the rider has been created before and all that. thank you Jesus!
router.post('/new', api.addProduct);

router.post('/pay', api.prepareProductPayment, pay);

/** SHOP ROUTER */

module.exports = router;
