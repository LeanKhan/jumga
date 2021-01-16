// const fetch = require('node-fetch');
const validator = require('validator').default;
const { nanoid } = require('nanoid');
const { slugify } = require('../../tools');
const Product = require('../../models/product');
const Shop = require('../../models/shop');
const Country = require('../../models/country');

module.exports = (() => {
  return {
    async authorizeShopAdmin(req, res, next) {
      if (!req.user.shop || !req.user.hasShop) {
        await req.flash('error', {
          msg: 'Only Shop Owners cannot do this!',
        });
        return res
          .status(401)
          .send({ success: false, msg: 'UNAUTHORISEEEED!' });
      }

      if (!req.isAuthenticated()) {
        await req.flash('error', {
          msg: 'You have to be signed in as a Merchant!',
        });
        return res
          .status(401)
          .send({ success: false, msg: 'UNAUTHORISEEEED!' });
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

      return next();
    },
    async addProduct(req, res) {
      try {
        const validationErrors = [];

        if (validator.isEmpty(req.body.name))
          validationErrors.push({ msg: 'Product Name cannot be blank.' });

        if (validator.isEmpty(req.body.description))
          validationErrors.push({ msg: 'Product Description cannot be blank' });

        if (validator.isEmpty(req.body.price))
          validationErrors.push({ msg: 'Product Price cannot be blank' });

        if (validator.isEmpty(req.body.shop_slug))
          validationErrors.push({ msg: 'Shop Slug Missing!' });

        if (!validator.isMongoId(req.user.shop.toString()))
          validationErrors.push({ msg: 'Invalid Shop id' });

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
          )
            .lean()
            .exec();
        };

        const slug = slugify(req.body.name);

        const product = new Product({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          slug,
          tags: req.body.tags,
          shop: req.user.shop,
          shop_slug: req.body.shop_slug,
        });

        return Product.findOne({
          slug,
          shop: req.user.shop,
        })
          .lean()
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
          .select('account _id dispatch_rider country')
          .populate('dispatch_rider', 'account')
          .lean()
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
          Country.findOne({ short_code: req.session.country || 'NG' })
            .lean()
            .exec(),
          Country.findOne({ short_code: shop.country }).lean().exec(),
        ]);

        let transaction_type;
        let fw_trx_fee; // $ tranx fee
        let delivery_fee; // should be getting this from db or somn
        const currency = cust_country.currency_code;
        const { payment_method } = req.body;

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
            cust_country.fw_processing_fees.international || 3.8
          );
          transaction_type = 'international';
          delivery_fee += 20; // add $20 dollars for international deliveries
        }

        if (payment_method == 'mobile_money_ghana') {
          fw_trx_fee = 2.5;
        }

        let product_commision = price * 0.025;
        let delivery_commision = delivery_fee * 0.2;
        const exchange_rate = parseFloat(cust_country.dollar_exchange_rate);

        // in
        let total_amount = (price + delivery_fee) / (1 - fw_trx_fee / 100);

        if (payment_method == 'mpesa') {
          if ((price + delivery_fee) * exchange_rate < 1500) {
            total_amount = price + delivery_fee + 35;
          }

          fw_trx_fee = cust_country.fw_processing_fees.local;
          total_amount = (price + delivery_fee) / (1 - fw_trx_fee / 100);
        }

        // here prepare the subaccounts payments...
        console.log(
          `price ,deli => ${price} df => ${delivery_fee}, fw_tf => ${fw_trx_fee} : all ${
            1 - fw_trx_fee / 100
          } `
        );

        console.log(
          cust_country.currency_code,
          shop_country.currency_code,
          `total_amount => ${total_amount}`
        );

        // const processing_fee = (total_amount - price - delivery_fee) * exchange_rate;

        // All this will be converted to the local exchange rate of the customer!
        total_amount *= exchange_rate;
        product_commision *= exchange_rate;
        delivery_commision *= exchange_rate;
        price *= exchange_rate;

        console.log(product_commision, ' <- p | d -> ', delivery_commision);

        // Payment type
        const type = 'product_payment';

        const data = {
          tx_ref: `jumga-tx-${nanoid(12)}`,
          amount: total_amount,
          currency,
          redirect_url: `${req.protocol}://${req.headers.host}/payments/verify?&amount=${total_amount}&currency=${currency}&type=${type}`,
          payment_options: payment_method || cust_country.payment_methods,
          meta: {
            user_id: req.user ? req.user._id : 'Customer',
            product_id: req.body.product_id,
            shop_id: shop._id,
            product_price: price / exchange_rate,
            dispatch_rider: shop.dispatch_rider._id,
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
              transaction_charge: price - product_commision,
            },

            {
              id: shop.dispatch_rider.account.subaccount_id, // dispatch rider
              transaction_charge_type: 'flat_subaccount',
              transaction_charge:
                delivery_fee * exchange_rate - delivery_commision,
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

        req.body.transaction_type = transaction_type;

        return next();
      } catch (err) {
        return next(err);
      }
    },

    getProducts(req, res) {
      const { shop } = req.query;

      Product.find({ shop })
        .lean()
        .exec()
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

    async updateProduct(req, res) {
      try {
        const { id } = req.params;
        const { update } = req.body;

        if (!id)
          return res.status(404).send({ success: false, msg: 'NO ID SENT!!' });
        if (!update)
          return res
            .status(404)
            .send({ success: false, msg: 'NO UPDATE SENT!!' });

        /** Remove unwanted properties */

        const slug = slugify(update.name);

        delete update.slug;
        delete update.shop;
        delete update.shop_slug;

        Product.findByIdAndUpdate(id, { ...update, slug }, { new: true })
          .lean()
          .exec()
          .then((product) => {
            console.log('Product updated successfully!');

            return res.status(200).send({
              success: true,
              msg: 'Product Updated successfully!',
              data: product,
            });
          })
          .catch((err) => {
            console.log('Error updating Product! -=>', err);
            return res.status(400).send({
              success: false,
              msg: 'Error updating Product!',
              error: err.message,
            });
          });
      } catch (error) {
        console.error('Error updating Product! => ', error);
        return res.status(400).send({
          success: false,
          msg: 'Error updating Product!',
          error: error.message,
        });
      }
    },

    async deleteProduct(req, res) {
      try {
        const { id } = req.params;

        // const findProduct = () => {
        //   return Product.findById(id)
        //   .lean()
        //   .exec();
        // }

        const p = await Product.findByIdAndDelete(id).lean().exec();

        if (!p) {
          console.log('Product does not exist!');

          return res.status(404).send({
            success: false,
            msg: 'Product does not exist!',
          });
        }

        Shop.findByIdAndUpdate(p.shop, { $pull: { products: p._id } })
          .lean()
          .exec()
          .then((s) => {
            if (p) {
              console.log('Deleted Product => ', s);
            }

            return res.status(200).send({
              success: true,
              msg: 'Product deleted successfully!',
              data: p,
            });
          });
      } catch (err) {
        console.error('Something went wrong while deleting product :/\n', err);

        return res.status(400).send({
          success: false,
          msg: 'Something went wrong while trying to delete Product :/',
          error: err.message,
        });
      }
    },
  };
})();
