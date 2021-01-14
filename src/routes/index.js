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
const Rider = require('../models/dispatch_rider');
const Category = require('../models/category');
const Country = require('../models/country');

/* Render home page */
router.get('/', function (req, res, next) {
  if (!req.params.shop_slug) {
    return views.renderHomePage(req, res, next);
  }

  return next('router');
});

router.get('/admin/dashboard', function (req, res) {
  res.locals.route_name = 'admin-dashboard';

  Rider.find({})
    .lean()
    .exec()
    .then((rs) => {
      return res.render('admin/dashboard', { dispatch_riders: rs });
    })
    .catch((err) => {
      console.error('Error fetching dispatch_riders =>\n', err);
    });
});

router.get('/explore', views.renderExplorePage);

router.get('/register', async function (req, res) {
  res.locals.route_name = 'open-shop';

  req.session.allow = false;

  const currentStep = req.query.step || 0;

  // check if user is admin, user is merchant, or user is registered.
  if (req.isAuthenticated() && (req.user.isAdmin || req.user.shop)) {
    await req.flash('error', {
      msg: "Admins or current Merchants can't create shops.",
    });
    return res.redirect('/');
  }

  if (req.isAuthenticated() && !req.user.isAdmin && !req.user.shop) {
    await req.flash('info', {
      msg: 'No need to register',
    });
  }

  // if (!req.isAuthenticated()) {
  //   await req.flash('error', {
  //     msg: 'You have to have an account to open a Shop',
  //   });
  //   return res.redirect(`/signup?returnTo=/register?step=0`);
  // }

  const [categories, countries] = await Promise.all([
    Category.find({}).lean().exec(),
    Country.find({}).lean().exec(),
  ]);

  return res.render('open-shop', {
    step: currentStep,
    categories: JSON.stringify(categories),
    countries: JSON.stringify(countries),
  });

  // Category.find({})
  //   .exec()
  //   .then((categories) => {
  //     return res.render('open-shop', {
  //       step: currentStep,
  //       categories: JSON.stringify(categories),
  //     });
  //   })
  //   .catch((err) => {
  //     console.error('Error fetching dispatch_riders =>\n', err);
  //   });
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

/** Data router */
router.use('/data', data);

router.use('/shops', shops);

router.use('/payments', pay);

router.use('/riders', riders);

router.use('/products', products);

router.get('/error', function (req, res) {
  res.render('error');
});

router.use('/:shop_slug', single_shop);

module.exports = router;
