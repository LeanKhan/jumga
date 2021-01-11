/* eslint-disable no-underscore-dangle */
const validator = require('validator');
const { nanoid } = require('nanoid');
const fetch = require('node-fetch');
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
        return res.redirect(`/signin?returnTo=${req.get('Referer')}`);
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

        const { returnTo } = req.session;
        delete req.session.returnTo;
        return res.redirect(returnTo || '/shops/new');
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
              const { returnTo } = req.session;
              delete req.session.returnTo;
              return res.redirect(returnTo || '/shops/new');
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
          req.session.returnTo =
            '/signin?returnTo=%2Fshops%2F12345%2Fdashboard';
          return next();
        })
        .catch((err) => {
          return next(err);
        });

      //   maybe create the shop first in the db then complete the payment?
      // thank you Jesus!

      // res.redirect('signin');
    },

    async prepareShopPayment(req, res, next) {
      // add validation checks here... thank you Jesus!

      try {
        const data = {
          tx_ref: `jumga-tx-${nanoid(12)}`,
          amount: '20',
          currency: 'USD',
          redirect_url: `${req.protocol}://${req.headers.host}/payments/verify`,
          payment_options: 'card',
          meta: {
            user_id: req.user._id,
            shop_id: req.body.shop._id,
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

        req.body.data = data;

        req.body.type = 'shop_payment';

        return next();
      } catch (err) {
        return next(err);
      }
    },
    async createSubaccount(req, res) {
      try {
        if (!req.user.shop) {
          await req.flash('error', {
            msg: "Admins or current Merchants can't create shops.",
          });
          return res.redirect('/');
        }

        if (!req.isAuthenticated()) {
          await req.flash('error', {
            msg: 'You have to be signed in to open a Shop',
          });
          return res.redirect('/signin?returnTo=%2Fshops%2Fdashboard');
        }

        // check if shop exists actually...

        const validationErrors = [];

        if (validator.isEmpty(req.body.account_name || ''))
          validationErrors.push({ msg: 'Account Name cannot be blank.' });

        if (validator.isEmpty(req.body.account_number || ''))
          validationErrors.push({ msg: 'Please provide an Account Number' });

        if (!validator.isMongoId(req.user.shop.toString() || ''))
          validationErrors.push({ msg: 'Invalid shop id' });

        if (validator.isEmpty(req.body.business_email.trim() || ''))
          validationErrors.push({ msg: 'Business Email cannot be blank' });

        if (!validator.isEmail(req.body.business_email.trim() || ''))
          validationErrors.push({
            msg: 'Please provide a valid Business Email',
          });

        if (validationErrors.length) {
          validationErrors.forEach(async (err) => {
            await req.flash('error', err);
          });

          return res.redirect('/shops/dashboard');
        }

        let current_shop;

        try {
          current_shop = await Shop.findOne({ _id: req.user.shop }).exec();

          if (!current_shop) {
            await req.flash('error', {
              msg: 'Shop does not exist!',
            });
            return res.redirect('/');
          }
        } catch (err) {
          return res.redirect('/error?c=shop_not_found');
        }

        const data = req.body;

        const updateShop = async (response) => {
          console.log(response);

          if (response.status != 'success') {
            await req.flash('error', { msg: response.message });
            throw new Error(JSON.stringify(response));
          }

          // const shopHasPaidFee = current_shop.hasPaidFee;

          return Shop.findOneAndUpdate(
            { _id: req.user.shop },
            {
              'account.subaccount_id': response.data.subaccount_id,
              'account.full_name': response.data.full_name,
              isApproved: current_shop.hasPaidFee,
            },
            { new: true }
          );
        };

        const payload = JSON.stringify({
          //   get it from request body
          account_bank: '044',
          account_number: data.account_number.trim(),
          business_name: current_shop.name,
          business_contact_mobile: req.user.phonenumber,
          business_mobile: req.user.phonenumber.trim(),
          business_email: data.business_email.trim(),
          country: data.country.trim().toUpperCase(),
          meta: [
            { meta_name: 'account_type', meta_value: 'shop' },
            { meta_name: 'merchant_id', meta_value: `${req.user._id}` },
            { meta_name: 'shop_id', meta_value: `${current_shop._id}` },
          ],
          split_type: 'percentage',
          split_value: 0.025,
        });

        fetch('https://api.flutterwave.com/v3/subaccounts', {
          method: 'post',
          body: payload,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.FW_SECRET_KEY.trim()}`,
          },
        })
          .then((res) => res.json())
          .then(updateShop)
          .then((shop) => {
            console.log('updated shop =>\n', shop);
            return res.redirect('/shops/dashboard');
          })
          .catch((err) => {
            console.error(err);
            return res.redirect('/shops/dashboard?error=rider_addition_failed');
          });
      } catch (error) {
        console.error('Something went wrong :/\n', error);

        return res.redirect(
          '/error?c=something_went_wrong&where=addding_shop_subaccount'
        );
      }
    },

    async getShop(req, res, next) {
      const shopID = req.user.shop || req.query.shop || req.params.shop_id;

      const validationErrors = [];

      if (!validator.isMongoId(shopID.toString()))
        validationErrors.push({ msg: 'Invalid Shop ID' });

      if (validationErrors.length) {
        validationErrors.forEach(async (err) => {
          await req.flash('error', err);
        });

        return res.redirect('/');
      }

      try {
        const current_shop = await Shop.findOne({ _id: shopID }).exec();

        if (!current_shop) {
          await req.flash('error', {
            msg: 'Shop does not exist!',
          });
          return res.redirect('/shops/dashboard');
        }

        req.body.shop = current_shop;

        return next();
      } catch (err) {
        return res.redirect('/error?c=shop_not_found');
      }
    },

    async openShop(req, res) {
      try {
        const shop_id = req.user.shop;

        const toggle = req.query.open;

        if (!shop_id)
          return res.status(400).send({
            success: false,
            msg: 'User shop not found/',
          });

        if (!toggle)
          return res.status(400).send({
            success: false,
            msg: 'No toggle option sent :/',
          });

        Shop.findOneAndUpdate(
          { _id: shop_id },
          { isLive: toggle },
          { new: true }
        )
          .then((s) => {
            if (!s)
              return res.status(400).send({
                success: false,
                msg: 'Shop not found!:/',
              });

            console.log('Shop opened successfully! Thank you Jesus!');

            return res.status(200).send({
              success: true,
              msg: `${s.name} opened successfully!`,
              isLive: s.isLive,
            });
          })
          .catch((err) => {
            console.error('Error opening shop! => ', err);

            return res.status(400).send({
              success: false,
              msg: 'Something went wrong while trying to open Shop :/',
              data: err,
            });
          });
      } catch (err) {
        return res.status(400).send({
          success: false,
          msg: 'Something went wrong while trying to open Shop :/',
          data: err,
        });
      }
    },
  };
})();
