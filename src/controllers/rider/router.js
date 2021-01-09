/* eslint-disable func-names */
const router = require('express').Router();
const api = require('./api');

// get all riders
router.get('/', api.getRiders);

/* GET home page. */
// check if isAuthenticated, isAdmin, if the rider has been created before and all that. thank you Jesus!
router.post('/new', api.addRider, api.createSubaccount);

module.exports = router;
