/* eslint-disable func-names */
const router = require('express').Router();

const api = require('./api');

// get products
router.get('/countries', api.getCountries);

router.patch('/countries/set', api.setUserCountry);

router.get('/categories', api.getCategories);

/* GET home page. */
// check if isAuthenticated, isAdmin, if the rider has been created before and all that. thank you Jesus!
router.post('/countries/new', api.addCountry);

router.post('/categories/new', api.addCategory);
/** SHOP ROUTER */

module.exports = router;
