const Shop = require('../../models/shop');
const Product = require('../../models/product');

module.exports = (() => {
  return {
    renderCreateShop(req, res) {
      res.render('merchant/new-shop');
    },

    renderAddAccount(req, res) {
      res.render('merchant/add-account');
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

          res.render('merchant/shop-dashboard', { shop: s });
        })
        .catch((err) => {
          console.error('error rendering shop dashboard =>\n', err);
          return res.redirect('/error');
        });
    },

    renderShop(req, res) {
      const { shop_slug: slug } = req.params;

      res.locals.route_name = 'shop';

      if (!slug) return res.redirect('/error?c=shop_slug_missing');

      // fetch shop data here...
      Shop.findOne({ slug })
        .populate('products')
        .exec()
        .then((s) => {
          if (!s) return res.redirect('/error?c=404_shop');

          if (!s.isLive) return res.redirect('/error?c=404_shop');

          res.render('merchant/shop', { shop: s });
        })
        .catch((err) => {
          console.error('error opening shop =>\n', err);
          return res.redirect('/error');
        });
    },

    renderProduct(req, res) {
      const { product_slug: slug } = req.params;

      console.log('what', slug);

      res.locals.route_name = 'shop';

      if (!slug) return res.redirect('/error?c=product_slug_missing');

      // fetch shop data here...
      Product.findOne({ slug })
        .populate('shop')
        .exec()
        .then((p) => {
          if (!p) return res.redirect('/error?c=404_product');

          // use alerts here... thank you Jesus!
          if (!p.shop.isLive) return res.redirect('/error?c=shop_is_not_live');

          res.render('merchant/product', { product: p });
        })
        .catch((err) => {
          console.error('error opening product page =>\n', err);
          return res.redirect('/error');
        });
    },
  };
})();
