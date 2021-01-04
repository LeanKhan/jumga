const Shop = require('../../models/shop');

module.exports = (() => {
  return {
    renderCreateShop(req, res) {
      res.render('shops/new-shop');
    },

    renderShopAdmin(req, res) {
      const { id } = req.params;

      if (req.user.shop_id != id)
        return res.redirect('/error?c=unauthorized&msg=not_shop_owner');

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
