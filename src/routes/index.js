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
const data = require('../controllers/data').router;
const { views } = require('../controllers/views');

/* Render home page */
/** I'm doing this to check if the client requests for the Shop
 * page or a shop.
 */
router.get('/', function (req, res, next) {
  if (!req.params.shop_slug) {
    return views.renderHomePage(req, res, next);
  }

  return next('router');
});

router.get('/admin/dashboard', user.api.isAdmin, views.renderAdminDashboard);

router.get('/explore', views.renderExplorePage);

router.get('/register', views.renderRegisterPage);

router.get('/success/:tx_ref', views.renderOrderSuccessPage);

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

router.use('/data', data);

router.use('/shops', shops);

router.use('/payments', pay);

router.use('/riders', riders);

router.use('/products', products);

router.get('/error', function (req, res) {
  res.locals.meta = {
    title: `Error | ${res.locals.meta.title}`,
    ...res.locals.meta,
  };

  res.locals.route_name = 'error';

  res.render('error');
});

router.get('/404', function (req, res) {
  res.locals.meta = {
    title: `404 | ${res.locals.meta.title}`,
    ...res.locals.meta,
  };

  res.locals.route_name = '404';

  res.render('error');
});

router.use('/:shop_slug', single_shop);

module.exports = router;
