/* eslint-disable func-names */
const router = require('express').Router();
const api = require('./api');

router.get('/verify', api.verify);

module.exports = router;
