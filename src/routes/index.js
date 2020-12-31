/* eslint-disable func-names */
const router = require('express').Router();
const userRoutes = require('../controllers/user');

/* GET home page. */
router.get('/', function (req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/signin', userRoutes.views.renderSignin);

module.exports = router;
