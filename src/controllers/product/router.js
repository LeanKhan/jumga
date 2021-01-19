/* eslint-disable func-names */
const router = require('express').Router();
const { uploadTemp } = require('../../tools/uploader');
const { isAuthenticated, isShopOwner } = require('../user/api');

const api = require('./api');
const { pay } = require('../pay').api;

// get products
router.get('/', api.getProducts);

/* GET home page. */
// check if isAuthenticated, isAdmin, if the rider has been created before and all that. thank you Jesus!
router.post('/new', api.authorizeShopAdmin, api.addProduct);

router.post('/pay', api.prepareProductPayment, pay);

// batch upload products!
router.post(
  '/:shop_id/batch-upload',
  isAuthenticated,
  isShopOwner,
  uploadTemp.single('csv'),
  api.batchUpload
);

router.put('/:id/update', api.authorizeShopAdmin, api.updateProduct);

router.delete('/:id', api.authorizeShopAdmin, api.deleteProduct);

module.exports = router;
