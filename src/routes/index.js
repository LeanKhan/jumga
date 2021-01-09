/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const router = require('express').Router();
const user = require('../controllers/user');
const {
  main_router: shops,
  shop_router: single_shop,
} = require('../controllers/shop');
const pay = require('../controllers/pay').router;
const riders = require('../controllers/rider').router;
const products = require('../controllers/product').router;
const { views } = require('../controllers/views');
const Rider = require('../models/dispatch_rider');
const { retryRequest: retry } = require('../tools');

/* Render home page */
router.get('/', function (req, res, next) {
  if (!req.params.shop_slug) {
    return views.renderHomePage(req, res, next);
  }

  return next('router');
});

router.get('/fake', (req, res) => {
  const status = [200, 408, 500, 200, 503];

  const fail = Math.round(Math.random() * (status.length - 1));

  res.status(status[fail]).json({ msg: 'HAHAHAHAAH!' });
});

router.get('/retry', async (req, res) => {
  const options = {
    method: 'get',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const finalResponse = await retry('http://localhost:3000/fake', options);

  console.log(finalResponse);

  return res.status(200).send('finish retry');
});

router.get('/admin/dashboard', function (req, res) {
  Rider.find({})
    .exec()
    .then((rs) => {
      const dispatch_riders = rs;
      return res.render('admin/dashboard', { dispatch_riders });
    })
    .catch((err) => {
      console.error('Error fetching dispatch_riders =>\n', err);
    });
});

router.get('/signin', user.views.renderSignin);

router.get('/signup', user.views.renderSignup);

router.get('/signout', user.api.logout);

router.post('/signin', user.api.login);

router.post(
  '/signup',
  user.api.signup,
  user.api.saveUser,
  user.api.loginNewUser,
  user.api.saveSession
);

router.use('/shops', shops);

router.use('/payments', pay);

router.use('/riders', riders);

router.use('/products', products);

router.get('/error', function (req, res) {
  res.render('error');
});

router.use('/:shop_slug', single_shop);

module.exports = router;
