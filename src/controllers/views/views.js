const Shop = require('../../models/shop');
const Product = require('../../models/product');
const Category = require('../../models/category');
const Country = require('../../models/country');
const Rider = require('../../models/dispatch_rider');
const Transaction = require('../../models/transaction');

module.exports = {
  renderHomePage(req, res, next) {
    try {
      Shop.find({ isLive: true, hasPaidFee: true })
        .limit(3)
        .select('name slug')
        .lean()
        .exec()
        .then((shops) => {
          res.render('home', { shops });
        })
        .catch((err) => {
          return next(err);
        });
    } catch (err) {
      console.error('Error rendering Home Page =>\n', err);
      return res.redirect('/error?error=rendering_page');
    }
  },

  renderAdminDashboard(req, res) {
    try {
      res.locals.route_name = 'admin-dashboard';

      Rider.find({})
        .lean()
        .exec()
        .then((rs) => {
          return res.render('admin/dashboard', { dispatch_riders: rs });
        })
        .catch((err) => {
          console.error('Error rendering Admin Dashboard =>\n', err);

          return res.redirect('/error?error=rendering_page');
        });
    } catch (err) {
      console.error('Error rendering Admin Dashboard =>\n', err);
      return res.redirect('/error?error=rendering_page');
    }
  },
  async renderExplorePage(req, res, next) {
    try {
      let search;
      if (req.query.search) {
        search = true;
      }

      const getter = () => {
        if (
          (search && !req.query.category) ||
          (search && req.query.category == 'none')
        ) {
          return Product.find({ $text: { $search: req.query.q } })
            .select('name slug price description picture shop tags')
            .populate('shop', 'name slug pictures.logo')
            .lean()
            .exec();
        }

        if (search && req.query.category != 'none' && req.query.category) {
          console.log('in shop stuff');
          return Shop.find({ category: req.query.category })
            .select('name slug picture products')
            .populate('products', 'name slug price picture tags')
            .lean()
            .exec();
        }

        if (
          search &&
          req.query.category != 'none' &&
          req.query.category &&
          req.query.q
        ) {
          console.log('in shop stuff for queries');
          return Shop.find({ category: req.query.category })
            .select('name slug picture products')
            .populate('products', 'name slug price picture tags')
            .lean()
            .exec();
        }

        return Product.find({})
          .limit(20)
          .select('name slug price description picture shop tags')
          .populate('shop', 'name slug pictures.logo')
          .lean()
          .exec();
      };

      res.locals.route_name = 'explore';

      const [categories, cust_country] = await Promise.all([
        Category.find({}).select('name slug').lean().exec(),
        Country.findOne({
          short_code: req.session.country || 'NG',
        })
          .select('currency_code dollar_exchange_rate')
          .lean()
          .exec(),
      ]);

      getter()
        .then((p) => {
          if (!req.query.category || req.query.category == 'none') {
            return res.render('explore', {
              products: p,
              categories,
              cust_country,
            });
          }

          // first compile products...
          let products;
          if (p) {
            products = p.map((shop) => {
              return shop.products.map((product) => {
                return {
                  ...product,
                  shop: {
                    name: shop.name,
                    slug: shop.slug,
                    pictures: shop.pictures,
                  },
                };
              });
            });
          }

          // TO flatten the array from [[a], [b]] -> [a, b]
          // https://stackoverflow.com/a/60677733/10382407
          products = [].concat(...products);

          return res.render('explore', {
            products: products || [],
            categories,
            cust_country,
          });
        })
        .catch((err) => {
          return next(err);
        });
    } catch (err) {
      console.log('Error rendering explore page!', err);

      return res.redirect('/error?error=rendering_page');
    }
  },
  renderOrderSuccessPage(req, res, next) {
    try {
      res.locals.route_name = 'success';

      const { tx_ref } = req.params;

      Transaction.findOne({ tx_ref, paid: true, verified: true })
        .select('transaction')
        .populate({
          path: 'transaction.meta.dispatch_rider',
          select: 'firstname lastname phonenumber',
          model: 'Rider',
        })
        .lean()
        .exec()
        .then((tx) => {
          console.log(tx);
          if (!tx) return res.redirect('/404?missing=order');
          return res.render('success', { tx });
        })
        .catch((err) => {
          return next(err);
        });
    } catch (err) {
      console.log('Error rendering Order Success Page => ', err);

      return res.redirect('/error?error=rendering_page');
    }
  },

  async renderRegisterPage(req, res) {
    try {
      res.locals.route_name = 'open-shop';

      req.session.allow = false;

      const currentStep = req.query.step || 0;

      if (currentStep != 2) {
        // check if user is admin, user is merchant, or user is registered.
        if (req.isAuthenticated() && (req.user.isAdmin || req.user.shop)) {
          await req.flash('error', {
            msg: "Admins or current Merchants can't create shops.",
          });
          return res.redirect('/');
        }

        if (req.isAuthenticated() && !req.user.isAdmin && !req.user.shop) {
          await req.flash('info', {
            msg: 'Already have an account, \n so just setup shop',
          });
        }

        if (req.isAuthenticated() && !req.user.isAdmin && req.user.shop) {
          await req.flash('info', {
            msg: 'Add your shop account',
          });
        }
      }

      const [categories, countries] = await Promise.all([
        Category.find({}).lean().exec(),
        Country.find({}).lean().exec(),
      ]);

      return res.render('register', {
        step: currentStep,
        categories: JSON.stringify(categories),
        countries: JSON.stringify(countries),
      });
    } catch (err) {
      console.log('Error rendering Register page => ', err);

      return res.redirect('/error?error=rendering_page');
    }
  },
};
