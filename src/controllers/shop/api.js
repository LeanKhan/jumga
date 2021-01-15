/* eslint-disable no-underscore-dangle */
const validator = require('validator');
const { nanoid } = require('nanoid');
const fetch = require('node-fetch');
const Shop = require('../../models/shop');
const User = require('../../models/user');
const Product = require('../../models/product');
const { slugify } = require('../../tools');

module.exports = {
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
    if (validator.isEmpty(req.body.country))
      validationErrors.push({ msg: 'Country cannot be blank.' });
    if (validator.isEmpty(req.body.category))
      validationErrors.push({ msg: 'Category cannot be blank' });

    // if (['food', 'tech', 'trash'].includes(req.body.category))
    //   validationErrors.push({ msg: 'Invalid category!' });

    if (validationErrors.length) {
      validationErrors.forEach(async (err) => {
        await req.flash('error', err);
      });

      const { returnTo } = req.session;
      delete req.session.returnTo;
      return res.redirect(returnTo || '/register?step=1');
    }

    const slug = slugify(req.body.shopName);

    const updateUser = (shop_id) => {
      return User.findOneAndUpdate(
        { _id: req.user._id },
        { shop: shop_id, hasShop: true }
      )
        .lean()
        .exec();
    };

    const addShop = () => {
      const shop = new Shop({
        name: req.body.shopName,
        slug,
        description: req.body.description,
        category: req.body.category,
        category_id: req.body.category_id,
        country: req.body.country,
        country_id: req.body.country_id,
        owner: req.user._id,
      });

      return Shop.findOne({ slug, owner: req.user._id })
        .lean()
        .exec()
        .then(async (existingShop) => {
          if (existingShop) {
            await req.flash('error', {
              msg: 'Shop with similar name already exists!',
            });
            const { returnTo } = req.session;
            delete req.session.returnTo;
            return res.redirect(returnTo || '/register?step=1');
          }
          // if not move on!

          return new Promise((resolve, reject) => {
            shop.save((err, s) => {
              if (err) {
                return reject(err);
              }

              req.body.shop = s;
              req.body.shop_id = s._id.toString();
              return resolve(s._id);
            });
          });
        });
    };

    return (
      addShop()
        .then(updateUser)
        // eslint-disable-next-line no-unused-vars
        .then(async (user) => {
          return next();
        })
        .catch((err) => {
          return next(err);
        })
    );

    //   maybe create the shop first in the db then complete the payment?
    // thank you Jesus!

    // res.redirect('signin');
  },

  async prepareShopPayment(req, res, next) {
    // add validation checks here... thank you Jesus!

    try {
      const currency = 'USD';
      const amount = '20';
      const type = 'shop_payment';
      console.log(req.body.shop_id);
      const data = {
        tx_ref: `jumga-tx-${nanoid(12)}`,
        amount: '20',
        currency: 'USD',
        redirect_url: `${req.protocol}://${req.headers.host}/payments/verify?&amount=${amount}&currency=${currency}&type=${type}`,
        // add transaction fee to amount
        payment_options: 'card',
        meta: {
          user_id: req.user._id,
          shop_id: req.body.shop_id || req.body.shop._id,
        },
        customer: {
          email: req.user.email,
          phone_number: req.user.phonenumber,
          name: `${req.user.firstname} ${req.user.lastname}`,
          user_id: req.user._id,
          shop_id: req.body.shop_id,
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
          msg: 'You no get Shop! Sign in and try again',
        });
        return res.redirect('/');
      }

      if (!req.isAuthenticated()) {
        await req.flash('error', {
          msg: 'You have to be signed in to add Shop account!',
        });
        return res.redirect('/signin?returnTo=/shops/dashboard');
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

        const { returnTo } = req.session;
        delete req.session.returnTo;
        return res.redirect(returnTo || '/register?step=2');
      }

      let current_shop;

      try {
        current_shop = await Shop.findOne({ _id: req.user.shop }).lean().exec();

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
        )
          .lean()
          .exec();
      };

      const payload = JSON.stringify({
        //   get it from request body
        account_bank: '044',
        account_number: data.account_number.trim(),
        business_name: current_shop.name,
        business_contact_mobile: req.user.phonenumber,
        business_mobile: req.user.phonenumber.trim(),
        business_email: data.business_email.trim(),
        country: current_shop.country.trim().toUpperCase(),
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
          return res.redirect('/shops/dashboard?error=account_addition_failed');
        });
    } catch (error) {
      console.error('Something went wrong :/\n', error);
      await req.flash('error', {
        msg:
          'Something went wrong adding your Shop Account. You can try again later',
      });

      const { returnTo } = req.session;
      delete req.session.returnTo;
      return res.redirect(returnTo || '/shops/dashboard');
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
      const current_shop = await Shop.findOne({ _id: shopID }).lean().exec();

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

  async updateShop(req, res) {
    try {
      const { shop: id } = req.user;
      const { update } = req.body;

      if (!req.user.shop) {
        await req.flash('error', {
          msg: "You don't even work here!",
        });
        return res
          .status(401)
          .send({ success: false, msg: 'UNAUTHORISEEEED!' });
      }

      if (!req.isAuthenticated()) {
        await req.flash('error', {
          msg: 'You have to be signed in to open a Shop',
        });
        return res
          .status(401)
          .send({ success: false, msg: 'UNAUTHORISEEEED!' });
      }

      if (!id)
        return res
          .status(404)
          .send({ success: false, msg: 'NO SHOP ID SENT!!' });
      if (!update)
        return res
          .status(404)
          .send({ success: false, msg: 'NO SHOP UPDATE SENT!!' });

      Shop.findByIdAndUpdate(id, update, { new: true })
        .lean()
        .exec()
        .then((shop) => {
          console.log('Shop updated successfully!');

          return res.status(200).send({
            success: true,
            msg: 'Shop Updated successfully!',
            data: shop,
          });
        })
        .catch((err) => {
          console.log('Erro updaitn shop! -=>', err);
          return res.status(400).send({
            success: false,
            msg: 'Error updating shop!',
            error: err.message,
          });
        });
    } catch (error) {
      console.error('Error updating Shop! => ', error);
      return res.status(400).send({
        success: false,
        msg: 'Error updating shop!',
        error: error.message,
      });
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

      Shop.findOneAndUpdate({ _id: shop_id }, { isLive: toggle }, { new: true })
        .lean()
        .exec()
        .then((s) => {
          if (!s)
            return res.status(400).send({
              success: false,
              msg: 'Shop not found!:/',
              error: { message: 'Shop Not found!' },
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
            error: err,
          });
        });
    } catch (err) {
      return res.status(400).send({
        success: false,
        msg: 'Something went wrong while trying to open Shop :/',
        error: err,
      });
    }
  },
  async searchShop(req, res) {
    try {
      const { shop_slug: slug } = req.params;

      res.locals.route_name = 'shop';

      if (!slug) return res.redirect('/error?c=shop_slug_missing');

      // fetch shop data here...
      const [products, shop] = await Promise.all([
        Product.find({ shop_slug: slug, $text: { $search: req.query.q } })
          .lean()
          .exec(),
        Shop.findOne({ slug }).lean().exec(),
      ]);

      if (!shop) return res.redirect('/error?c=404_shop');

      if (!shop.isLive) return res.redirect('/error?c=404_shop');

      return res.render('merchant/shop', { shop, products });
    } catch (err) {
      return res
        .status(400)
        .send({ succes: false, msg: 'Error searching shop!' });
    }
  },

  async getShops(req, res) {
    try {
      let { query } = req.query;

      try {
        query = JSON.parse(query);
      } catch (err) {
        console.log('Erro parsing get shops query');
        query = {};
      }

      Shop.find(query)
        .lean()
        .exec()
        .then((shops) => {
          return res.status(200).send({
            success: true,
            msg: 'Shops fetched successfully!',
            data: shops,
          });
        })
        .catch((err) => {
          console.error('Error fetching Shops! => ', err);
          return res.status(400).send({
            success: false,
            msg: 'Error fetching Shops!',
            error: err.message,
          });
        });
    } catch (err) {
      console.error('Error fetching Shops! => ', err);
      return res.status(400).send({
        success: false,
        msg: 'Error fetching Shops!',
        error: err.message,
      });
    }
  },

  async fetchShop(req, res) {
    try {
      let select;
      let populate;
      if (req.query.select) {
        console.log('Select these!', req.query.select);
        select = req.query.select.replace(/,/g, ' ');
      }

      if (req.query.populate) {
        console.log('poppoo');
        populate = req.query.populate;
      }

      const getter = () => {
        if (select && populate) {
          console.log('here in botle');
          return Shop.findById(req.params.id)
            .select(select)
            .populate(populate)
            .lean()
            .exec();
        }

        if (select) {
          return Shop.findById(req.params.id).select(select).lean().exec();
        }

        if (populate) {
          return Shop.findById(req.params.id).populate(populate).lean().exec();
        }

        return Shop.findById(req.params.id).lean().exec();
      };

      getter()
        .then((shop) => {
          return res.status(200).json({
            success: true,
            msg: 'Shop Fetched succesffuly!',
            data: shop,
          });
        })
        .catch((error) => {
          return res.status(400).json({
            success: false,
            msg: 'Could not fetch Shop',
            error: error.message,
          });
        });
    } catch (err) {
      return res.status(400).json({
        success: false,
        msg: 'Could not fetch Shop',
        error: err.message,
      });
    }
  },
};
