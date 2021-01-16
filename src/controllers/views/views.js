const Shop = require('../../models/shop');
const Product = require('../../models/product');
const Category = require('../../models/category');
const Country = require('../../models/country');
const Transaction = require('../../models/transaction');

module.exports = {
  renderHomePage(req, res, next) {
    Shop.find({})
      .select('name slug')
      .lean()
      .exec()
      .then((shops) => {
        res.render('home', { shops });
      })
      .catch((err) => {
        return next(err);
      });
  },
  async renderExplorePage(req, res, next) {
    try {
      let search;
      if (req.query.search) {
        console.log('Select these!', req.query.select);
        search = true;
      }

      const getter = () => {
        if (search) {
          return Product.find({ $text: { $search: req.query.q } })
            .select('name slug price description shop tags')
            .populate('shop', 'name slug pictures.logo')
            .lean()
            .exec();
        }

        // if (select) {
        //   return Shop.findById(req.params.id).select(select).lean().exec();
        // }

        // if (populate) {
        //   return Shop.findById(req.params.id).populate(populate).lean().exec();
        // }

        return Product.find({})
          .select('name slug price description shop tags')
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
          .select('currency_code')
          .lean()
          .exec(),
      ]);

      getter()
        .then((p) => {
          return res.render('explore', {
            products: p,
            categories,
            cust_country,
          });
        })
        .catch((err) => {
          return next(err);
        });
    } catch (err) {
      console.log('Error rendering Explroe pagE!', err);
    }
  },
  renderOrderSuccessPage(req, res, next) {
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
  },

  async renderRegisterPage(req, res) {
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

    // if (!req.isAuthenticated()) {
    //   await req.flash('error', {
    //     msg: 'You have to have an account to open a Shop',
    //   });
    //   return res.redirect(`/signup?returnTo=/register?step=0`);
    // }

    const [categories, countries] = await Promise.all([
      Category.find({}).lean().exec(),
      Country.find({}).lean().exec(),
    ]);

    return res.render('register', {
      step: currentStep,
      categories: JSON.stringify(categories),
      countries: JSON.stringify(countries),
    });
  },
};
