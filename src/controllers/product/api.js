// const fetch = require('node-fetch');
const validator = require('validator').default;
const { nanoid } = require('nanoid');
const { slugify } = require('../../tools');
const Product = require('../../models/product');
const Shop = require('../../models/shop');

module.exports = (() => {
  return {
    async addProduct(req, res) {
      try {
        if (!req.isAuthenticated()) {
          await req.flash('error', {
            msg: 'You have to be signed in to open a Shop',
          });
          return res.redirect('/signin?returnTo=%2Fshops%2Fdashboard');
        }

        if (!req.user.shop || !req.user.hasShop) {
          await req.flash('error', {
            msg: "You don't own a shop",
          });
          return res.redirect('/signin?returnTo=%2Fshops%2Fdashboard');
        }

        // if (req.user.shop != req.body.shop._id) {
        //   await req.flash('error', {
        //     msg: "You don't own this shop",
        //   });
        //   return res.status(400).send({
        //     success: false,
        //     msg: "You don' own this shop!",
        //   });
        // }

        const validationErrors = [];

        if (validator.isEmpty(req.body.name))
          validationErrors.push({ msg: 'Product Name cannot be blank.' });

        if (validator.isEmpty(req.body.description))
          validationErrors.push({ msg: 'Product description cannot be blank' });

        if (validator.isEmpty(req.body.price))
          validationErrors.push({ msg: 'Product price cannot be blank' });

        // if (validator.isNumeric(req.body.price, { no_symbols: false }))
        //   validationErrors.push({ msg: 'Price must be currency' });

        if (!validator.isMongoId(req.user.shop.toString()))
          validationErrors.push({ msg: 'Invalid shop id' });

        if (!['food', 'tech', 'trash'].includes(req.body.category))
          validationErrors.push({ msg: 'Invalid category!' });

        // if (['food', 'tech', 'trash'].includes(req.body.tags))
        // validationErrors.push({ msg: 'Invalid category!' });

        if (validationErrors.length) {
          validationErrors.forEach(async (err) => {
            await req.flash('error', err);
          });

          return res.status(400).send({
            success: false,
            msg: 'Something went wrong while trying to add Product :/',
            alerts: validationErrors,
          });
        }

        const updateShop = (product_id) => {
          return Shop.findOneAndUpdate(
            { _id: req.user.shop },
            { $push: { products: product_id } }
          );
        };

        const slug = slugify(req.body.name);

        const product = new Product({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          slug,
          category: req.body.category,
          tags: req.body.tags,
          shop: req.user.shop,
        });

        return Product.findOne({
          slug,
          shop: req.user.shop,
        })
          .exec()
          .then(async (existingProduct) => {
            if (existingProduct) {
              await req.flash('error', {
                msg: 'Product with same name already exists!',
              });

              return res.status(400).send({
                success: false,
                msg: 'Product with same name already exists!',
                error: { message: 'Product with same name already exists!' },
              });
            }
            // if not move on!

            product.save((error, p) => {
              if (error) {
                return res.status(400).send({ success: false, error });
              }
              // return next();
              updateShop(p._id)
                .then((s) => {
                  return res.status(200).send({
                    success: true,
                    msg: 'Product added successfully!',
                    data: s,
                  });
                })
                .catch((err) => {
                  throw err;
                });
            });
          });
      } catch (error) {
        console.error('Something went wrong while adding product :/\n', error);

        return res.status(400).send({
          success: false,
          msg: 'Something went wrong while trying to add Product :/',
          error,
        });
      }
    },

    async prepareProductPayment(req, res, next) {
      // add validation checks here
      try {
        const validationErrors = [];

        if (validator.isEmpty(req.body.price || ''))
          validationErrors.push({ msg: 'Price cannot be blank' });

        if (validator.isEmpty(req.body.currency || ''))
          validationErrors.push({ msg: 'Please provide a Shop Description' });

        if (validator.isEmpty(req.body.product_id || ''))
          validationErrors.push({ msg: 'Product ID not found' });

        if (validator.isEmpty(req.body.email || ''))
          validationErrors.push({ msg: 'Please provide an Email address' });

        if (validator.isEmpty(req.body.phonenumber || ''))
          validationErrors.push({ msg: 'Please provide a Phonenumber' });
        if (validator.isEmpty(req.body.name || ''))
          validationErrors.push({ msg: 'Please provide a Fullname' });

        if (validator.isEmpty(req.body.quantity || ''))
          validationErrors.push({ msg: 'No Quantity specified' });

        if (validator.isEmpty(req.body.product_name || ''))
          validationErrors.push({ msg: 'Product Name not found' });

        if (validationErrors.length) {
          validationErrors.forEach(async (err) => {
            await req.flash('error', err);
          });

          const { returnTo } = req.session;
          delete req.session.returnTo;
          return res.redirect(returnTo || '/error?error=preparing_payment');
        }

        const shop = await Shop.findOne({ _id: req.body.shop_id })
          .populate('dispatch_rider')
          .exec();

        if (!shop) {
          await req.flash('error', {
            msg: 'Shop does not exist!',
          });
          const { returnTo } = req.session;
          delete req.session.returnTo;
          return res.redirect(returnTo || '/error?error=preparing_payment');
        }

        const { price, delivery_fee } = req.body;

        const fw_trx_fee = 0.038; // $ tranx fee

        const product_commision = parseInt(price) * 0.025;
        const delivery_commision = parseInt(delivery_fee) * 0.2;
        const total_amount =
          (parseInt(price) + parseInt(delivery_fee)) / (1 - fw_trx_fee);

        console.log(product_commision, ' <- p | d -> ', delivery_commision);

        // here prepare the subaccounts payments...

        // Payment type
        const type = 'product_payment';

        const data = {
          tx_ref: `jumga-tx-${nanoid(12)}`,
          amount: total_amount,
          currency: req.body.currency,
          redirect_url: `${req.protocol}://${req.headers.host}/payments/verify?&amount=${total_amount}&currency=${req.body.currency}&type=${type}`,
          payment_options: 'card',
          meta: {
            user_id: req.user._id,
            product_id: req.body.product_id,
            shop_id: shop._id,
            product_price: price,
            delivery_fee,
          },
          customer: {
            email: req.body.email,
            phone_number: req.body.phonenumber,
            name: req.body.name,
          },
          subaccounts: [
            {
              id: shop.account.subaccount_id, // shop merchant
              transaction_charge_type: 'flat_subaccount',
              transaction_charge: `${price - product_commision}`,
            },

            {
              id: shop.dispatch_rider.account.subaccount_id, // dispatch rider
              transaction_charge_type: 'flat_subaccount',
              transaction_charge: `${delivery_fee - delivery_commision}`,
            },
          ],
          customizations: {
            title: 'Jumga Stores',
            description: `Pay for ${req.body.quantity} ${req.body.product_name}`,
            logo: 'https://assets',
          },
        };

        req.body.data = data;

        req.body.type = type;

        return next();
      } catch (err) {
        return next(err);
      }
    },

    getProducts(req, res) {
      const { shop } = req.query;

      Product.find({ shop })
        .then((products) => {
          return res.status(200).json({
            success: true,
            msg: 'Products Fetched succesffulY!',
            data: products,
          });
        })
        .catch((error) => {
          return res.status(400).json({
            success: false,
            msg: 'Could not fetch Products',
            error,
          });
        });
    },
  };
})();
