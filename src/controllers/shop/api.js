/* eslint-disable no-underscore-dangle */
const validator = require('validator');
const bent = require('bent');
const Shop = require('../../models/shop');
const User = require('../../models/user');
const { slugify } = require('../../tools');

module.exports = (() => {
  return {
    async createShop(req, res, next) {
      //   first check if user already has shop...
      // check if user is an Admin...
      // check if name already exists!
      // after shop has been created, then redirect to shop admin page...
      // thank you Jesus...
      // myshop.localhost:8080/admin

      if (req.user.isAdmin || req.user.shop) {
        await req.flash('error', {
          msg: "Admins or current Merchants can't create shops.",
        });
        return res.redirect('/');
      }

      if (!req.isAuthenticated()) {
        await req.flash('error', {
          msg: 'You have to be signed in to open a Shop',
        });
        return res.redirect('/signin?returnTo=%2Fshops%2Fnew');
      }

      const validationErrors = [];

      if (validator.isEmpty(req.body.shopName))
        validationErrors.push({ msg: 'Shop Name cannot be blank.' });
      if (validator.isEmpty(req.body.description))
        validationErrors.push({ msg: 'Please provide a Shop Description' });

      if (['food', 'tech', 'trash'].includes(req.body.category))
        validationErrors.push({ msg: 'Invalid category!' });

      if (validationErrors.length) {
        validationErrors.forEach(async (err) => {
          await req.flash('error', err);
        });

        return res.redirect('/shops/new');
      }

      const slug = slugify(req.body.shopName);

      const updateUser = (shop_id) => {
        return User.findOneAndUpdate(
          { _id: req.user._id },
          { shop: shop_id, hasShop: true }
        );
      };

      const addShop = () => {
        const shop = new Shop({
          name: req.body.shopName,
          slug,
          description: req.body.description,
          category: req.body.category,
          owner: req.user._id,
        });

        return Shop.findOne({ slug, owner: req.user._id })
          .exec()
          .then(async (existingShop) => {
            if (existingShop) {
              await req.flash('error', {
                msg: 'Shop with similar name already exists!',
              });
              return res.redirect('/shops/new');
            }
            // if not move on!

            return new Promise((resolve, reject) => {
              shop.save((err, s) => {
                if (err) {
                  return reject(err);
                }

                req.body.shop = s;
                return resolve(s);
              });
            });
          });
      };

      addShop()
        .then(updateUser)
        // eslint-disable-next-line no-unused-vars
        .then((user) => {
          //   req.body.shop = s;
          req.session.returnTo = '/signin?returnTo=%2Fshops%2F12345%2Fadmin';
          return next();
        })
        .catch((err) => {
          return next(err);
        });

      //   maybe create the shop first in the db then complete the payment?
      // thank you Jesus!

      // res.redirect('signin');
    },

    async collectShopPayment(req, res) {
      const data = {
        tx_ref: 'hooli-tx-1920bbtytty',
        amount: '20',
        currency: 'USD',
        redirect_url: `http://${req.headers.host}/pay/verify`,
        payment_options: 'card',
        meta: {
          user_id: req.user._id,
        },
        customer: {
          email: 'user@gmail.com',
          phonenumber: '080****4528',
          name: 'Yemi Desola',
          user_id: req.user._id,
          shop_id: req.body.shop._id,
        },
        customizations: {
          title: 'Jumga Stores',
          description: 'Pay small token to setup your shop',
          logo: 'https://assets.',
        },
      };

      const post = bent('https://api.flutterwave.com/v3/', 'POST', 'json', 200);

      let response;

      try {
        response = await post('payments', data, {
          Authorization: `Bearer ${process.env.FW_SECRET_KEY.trim()}`,
        });
        console.log(response);

        if (response.data.link) return res.redirect(response.data.link);

        return res.redirect('/?error=payment_failed');
      } catch (err) {
        console.log('Error paying for shop\n', err);
        return res.status(400).send({ msg: 'Error paying for shop :(', err });
      }
    },

    renderSignup(req, res) {
      res.render('signup');
    },
  };
})();
