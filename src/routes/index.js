/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
const router = require('express').Router();
const user = require('../controllers/user');
const shops = require('../controllers/shop').router;
const pay = require('../controllers/pay').router;
const Rider = require('../models/dispatch_rider');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('home');
});

router.get('/admin/dashboard', function (req, res) {
  res.render('admin/dashboard');
});

router.post('/new-rider', function (req, res) {
  const rider = new Rider({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    picture: req.body.picture,
  });

  return Rider.findOne({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    owner: req.user._id,
  })
    .exec()
    .then(async (existingRider) => {
      if (existingRider) {
        await req.flash('error', {
          msg: 'Rider with similar name already exists!',
        });
        return res.redirect('admin/dashboard');
      }
      // if not move on!

      rider.save((err, s) => {
        if (err) {
          return res.status(400).end(err);
        }

        req.body.rider = s;
        return res.render('admin/dashboard');
      });
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

router.get('/error', function (req, res) {
  res.render('error');
});

module.exports = router;
