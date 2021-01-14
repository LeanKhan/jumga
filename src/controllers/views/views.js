const Shop = require('../../models/shop');
const Product = require('../../models/product');

module.exports = (() => {
  return {
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
    renderExplorePage(req, res, next) {
      res.locals.route_name = 'explore';

      Product.find({})
        .lean()
        .exec()
        .then((p) => {
          return res.render('explore', { products: p });
        })
        .catch((err) => {
          return next(err);
        });
    },
  };
})();
