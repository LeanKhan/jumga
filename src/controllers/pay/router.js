/* eslint-disable func-names */
const router = require('express').Router();
const api = require('./api');

/* GET home page. */
router.get('/verify', api().verifyPayment);

module.exports = router;
