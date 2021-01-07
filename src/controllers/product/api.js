// const fetch = require('node-fetch');
const validator = require('validator').default;
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

        const product = new Product({
          name: req.body.name,
          description: req.body.description,
          price: req.body.price,
          category: req.body.category,
          tags: req.body.tags,
          shop: req.body.shop_id,
        });

        const slug = slugify(req.body.name);

        return Product.findOne({
          slug,
          shop: req.body.shop_id,
        })
          .exec()
          .then(async (existingProduct) => {
            if (existingProduct) {
              await req.flash('error', {
                msg: 'Product with similar name already exists!',
              });

              return res.status(400).send({
                success: false,
                msg: 'Product with similar name already exists!',
              });
            }
            // if not move on!

            product.save((err, p) => {
              if (err) {
                return res.status(400).send(err);
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
          data: error,
        });
      }
    },
  };
})();
