const Shop = require('../../models/shop');
const Product = require('../../models/product');
const Country = require('../../models/country');

module.exports = {
  renderCreateShop(req, res) {
    // check if this person has an account...
    // check if this is an admin

    res.render('merchant/new-shop');
  },

  renderShopPayment(req, res) {
    // check if this person has an account...
    // check if this is an admin

    const id = req.user.shop;

    res.locals.meta = {
      title: `Pay for Shop| ${res.locals.meta.title}`,
      ...res.locals.meta,
    };

    Shop.findById(id)
      .select('name _id')
      .lean()
      .exec()
      .then((s) => {
        if (!s) return res.redirect('/404?missing=shop');

        console.log(s);

        return res.render('merchant/pay-for-shop', { shop: s });
      })
      .catch((err) => {
        console.error('error rendering pay for shop =>\n', err);
        return res.redirect('/error?error=rendering_pay_page');
      });
  },

  renderAddAccount(req, res) {
    res.locals.meta = {
      title: `Add Shop Account | ${res.locals.meta.title}`,
      ...res.locals.meta,
    };
    res.render('merchant/add-account');
  },

  renderShopAdmin(req, res) {
    const id = req.user.shop;

    res.locals.meta = {
      title: `Shop Dashboard | ${res.locals.meta.title}`,
      ...res.locals.meta,
    };

    res.locals.route_name = 'shop-dashboard';

    if (!id) return res.redirect('/error?error=shop_id_missing');

    // fetch shop data here...
    Shop.findById(id)
      .lean()
      .populate('products country_id category_id')
      .exec()
      .then((s) => {
        if (!s) return res.redirect('/404?missing=shop');

        res.render('merchant/shop-dashboard', { shop: s });
      })
      .catch((err) => {
        console.error('error rendering shop dashboard =>\n', err);
        return res.redirect(
          '/error?error=rendering_shop_admin_page&reason=unknown_error'
        );
      });
  },

  async renderShop(req, res) {
    const { shop_slug: slug } = req.params;

    res.locals.route_name = 'shop';

    if (!slug) return res.redirect('/error?error=shop_slug_missing');

    // fetch shop data here...
    Shop.findOne({ slug })
      .lean()
      .populate('products country_id')
      .exec()
      .then(async (s) => {
        if (!s) return res.redirect('/404?missing=shop');

        if (!s.isLive) return res.redirect('/404?missing=shop');

        const cust_country = await Country.findOne({
          short_code: req.session.country || 'NG',
        })
          .lean()
          .exec();

        res.locals.meta = {
          title: `${s.name} | ${res.locals.meta.title}`,
          ...res.locals.meta,
        };

        res.render('merchant/shop', {
          shop: s,
          products: s.products,
          cust_country,
        });
      })
      .catch((err) => {
        console.error('error opening shop =>\n', err);
        return res.redirect('/error?error=rendering_shop_page&reason=unknown');
      });
  },

  renderProduct(req, res) {
    const { product_slug: slug } = req.params;

    res.locals.route_name = 'shop';

    if (!slug) return res.redirect('/error?error=product_slug_missing');

    // fetch shop data here...
    Product.findOne({ slug })
      .lean()
      .populate('shop')
      .exec()
      .then(async (p) => {
        if (!p) return res.redirect('/404?missing=product');

        console.log('country => ', req.session.country);

        const [cust_country, shop_country] = await Promise.all([
          Country.findOne({ short_code: req.session.country || 'NG' })
            .lean()
            .exec(),
          Country.findOne({ short_code: p.shop.country }).lean().exec(),
        ]);

        // use alerts here... thank you Jesus!
        if (!p.shop.isLive) return res.redirect('/404?missing=shop');

        let fw_trx_fee; // $ tranx fee. get this from Country
        let transaction_type;

        // check if the transaction is local or international, then change
        // transaction fee and currency...
        if (shop_country.short_code == cust_country.short_code) {
          console.log('Local Transaction');
          fw_trx_fee = cust_country.fw_processing_fees.local;
          transaction_type = 'local';
        }

        if (shop_country.short_code != cust_country.short_code) {
          console.log('International Transaction');
          if (shop_country.short_code == 'GB') {
            console.log('Inside the UK');
          }

          fw_trx_fee = cust_country.fw_processing_fees.international || 3.8;
          transaction_type = 'international';
        }

        const price = parseFloat(p.price);

        let delivery_fee;

        if (price > 1500) {
          delivery_fee = 150;
        } else {
          delivery_fee = 15;
        }

        const exchange_rate = parseFloat(cust_country.dollar_exchange_rate);

        // All in Dollars for now...
        const total_amount =
          (price + delivery_fee) / (1 - parseFloat(fw_trx_fee) / 100);

        let processing_fee = total_amount - price - delivery_fee;

        processing_fee =
          Math.round((processing_fee + Number.EPSILON) * 100) / 100;

        res.locals.meta = {
          title: `Buy ${p.name} from ${p.shop.name} | ${res.locals.meta.title}`,
          ...res.locals.meta,
        };

        res.render('merchant/product', {
          product: p,
          shop: p.shop,
          price,
          total_amount,
          delivery_fee,
          fw_trx_fee,
          cust_country,
          transaction_type,
          exchange_rate,
          processing_fee,
        });
      })
      .catch((err) => {
        console.error('error opening product page =>\n', err);
        return res.redirect(
          '/error?error=rendering_product_page&reason=unknown'
        );
      });
  },
};
