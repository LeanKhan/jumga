const Shop = require('../../models/shop');

module.exports = (() => {
  return {
    renderHomePage(req, res, next) {
      Shop.find({})
        .exec()
        .then((shops) => {
          res.render('home', { shops });
        })
        .catch((err) => {
          return next(err);
        });
    },
  };
})();
