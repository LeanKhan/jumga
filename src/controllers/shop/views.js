const Shop = require('../../models/shop');

module.exports = (() => {
  return {
    renderCreateShop(req, res) {
      res.render('shops/new-shop');
    },

    renderAddAccount(req, res) {
      res.render('shops/add-account');
    },

    renderShopAdmin(req, res) {
      const id = req.user.shop;

      res.locals.route_name = 'shop-dashboard';

      if (!id) return res.redirect('/error?c=shop_id_missing');

      // fetch shop data here...
      Shop.findById(id)
        .populate('products')
        .exec()
        .then((s) => {
          if (!s) return res.redirect('/error?c=404_shop');

          res.render('shops/shop-dashboard', { shop: s });
        })
        .catch((err) => {
          console.error('error rendering shop dashboard =>\n', err);
          return res.redirect('/error');
        });
    },

    renderShop(req, res) {
      const { slug } = req.params;

      res.locals.route_name = 'shop';

      if (!slug) return res.redirect('/error?c=shop_slug_missing');

      // fetch shop data here...
      Shop.findOne({ slug })
        .populate('products')
        .exec()
        .then((s) => {
          if (!s) return res.redirect('/error?c=404_shop');

          if (!s.isLive) return res.redirect('/error?c=404_shop');

          res.render('shops/shop', { shop: s });
        })
        .catch((err) => {
          console.error('error opening shop =>\n', err);
          return res.redirect('/error');
        });
    },
  };
})();
