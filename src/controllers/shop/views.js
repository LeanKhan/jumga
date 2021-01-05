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

      if (!id) return res.redirect('/error?c=shop_id_missing');

      // fetch shop data here...
      Shop.findById(id)
        .exec()
        .then((s) => {
          if (!s) return res.redirect('/error?c=404_shop');

          res.render('shops/shop-admin', { shop: s });
        })
        .catch((err) => {
          console.error('error fetching shop fot admin =>\n', err);
          return res.redirect('/error');
        });
    },
  };
})();
