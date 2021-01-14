// const fetch = require('node-fetch');
const validator = require('validator').default;
const { nanoid } = require('nanoid');
const { slugify } = require('../../tools');
const Product = require('../../models/product');
const Shop = require('../../models/shop');
const Country = require('../../models/country');

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

        let { price } = req.body;

        price = parseFloat(price);

        const [cust_country, shop_country] = await Promise.all([
          Country.findOne({ short_code: req.session.country || 'NG' }),
          Country.findOne({ short_code: shop.country }),
        ]);

        let transaction_type;
        let fw_trx_fee; // $ tranx fee
        let delivery_fee; // should be getting this from db or somn
        let currency = 'USD';

        if (price > 1500) {
          delivery_fee = 150;
        } else {
          delivery_fee = 15;
        }

        // All of these transactions are in DOLLARS, expect specified

        // check if the transaction is local or international, then change
        // transaction fee and currency...
        if (shop_country.short_code == cust_country.short_code) {
          console.log('Local Transaction - from server');
          fw_trx_fee = parseFloat(cust_country.fw_processing_fees.local);
          transaction_type = 'local';
        }

        if (shop_country.short_code != cust_country.short_code) {
          console.log('International Transaction - from server');
          if (shop_country.short_code == 'UK') {
            console.log('Inside the UK');
          }

          fw_trx_fee = parseFloat(
            cust_country.fw_processing_fees.international
          );
          transaction_type = 'international';
        }

        let product_commision = price * 0.025;
        let delivery_commision = delivery_fee * 0.2;

        // in
        let total_amount = (price + delivery_fee) / (1 - fw_trx_fee / 100);

        // here prepare the subaccounts payments...
        console.log(
          `price + deli => ${
            price + delivery_fee
          } fw_tf => ${fw_trx_fee} : all ${1 - fw_trx_fee / 100} `
        );

        console.log(
          cust_country,
          shop_country,
          `total_amount => ${total_amount}`
        );

        const exchange_rate = parseFloat(cust_country.dollar_exchange_rate);

        // const processing_fee = (total_amount - price - delivery_fee) * exchange_rate;

        if (transaction_type == 'local') {
          total_amount *= exchange_rate;
          product_commision *= exchange_rate;
          delivery_commision *= exchange_rate;
          currency = cust_country.currency_code;
        }

        console.log(product_commision, ' <- p | d -> ', delivery_commision);

        // Payment type
        const type = 'product_payment';

        const data = {
          tx_ref: `jumga-tx-${nanoid(12)}`,
          amount: total_amount,
          currency,
          redirect_url: `${req.protocol}://${req.headers.host}/payments/verify?&amount=${total_amount}&currency=${currency}&type=${type}`,
          payment_options: 'card',
          meta: {
            user_id: req.user ? req.user._id : 'Customer',
            product_id: req.body.product_id,
            shop_id: shop._id,
            product_price: price,
            delivery_fee,
            currency,
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
            description: `Pay for 1 ${req.body.product_name}`,
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
