/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const router = require('express').Router();
const user = require('../controllers/user');
const shops = require('../controllers/shop').router;
const pay = require('../controllers/pay').router;
const riders = require('../controllers/rider').router;
const Rider = require('../models/dispatch_rider');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('home');
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

router.use('/pay', pay);

router.use('/riders', riders);

router.get('/error', function (req, res) {
  res.render('error');
});

module.exports = router;
