/* eslint-disable func-names */
const router = require('express').Router();

const api = require('./api');

router.get('/countries', api.getCountries);

router.patch('/countries/set', api.setUserCountry);

router.get('/categories', api.getCategories);

router.put('/countries/:id/update', api.updateCountry);

router.put('/categories/:id/update', api.updateCategory);

router.post('/countries/new', api.addCountry);

router.post('/categories/new', api.addCategory);

module.exports = router;
