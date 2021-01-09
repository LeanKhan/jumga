/* eslint-disable no-underscore-dangle */
const bent = require('bent');
const validator = require('validator').default;
const Shop = require('../../models/shop');
const Rider = require('../../models/dispatch_rider');
// const { retryRequest: retry } = require('../../tools');

async function handleProductPayment(req, res, next) {
  // code here...
  try {
    const { transaction_response: response } = res.locals;

    if (!response) {
      await req.flash('error', { msg: 'No Transaction Response!' });

      const { returnTo } = req.session;
      delete req.session.returnTo;
      return res.redirect(returnTo || '/error?error=verifying_payment');
    }

    await req.flash('success', { msg: 'Product Paid for successfully!' });

    const { returnTo } = req.session;
    delete req.session.returnTo;
    return res.redirect(returnTo || '/');
  } catch (err) {
    // yooooo
    return next(err);
  }
}

async function handleShopPayment(req, res, next) {
  try {
    // res.send()
    // verify payment here...

    const { transaction_response: response } = res.locals;

    if (!response) {
      await req.flash('error', { msg: 'Transaction Response missing!' });

      const { returnTo } = req.session;
      delete req.session.returnTo;
      return res.redirect(returnTo || '/error?error=verifying_payment');
    }

    const updateShop = (shop_id, rider) => {
      return Shop.findOneAndUpdate(
        { _id: shop_id },
        { hasPaidFee: true, dispatch_rider: rider },
        { new: true }
      );
    };

    const getDispatchRider = () => {
      // Rider.findOne({
      //   employed: false,
      //   'account.subaccount_id': { $exists: true, $ne: null },
      // }).exec();

      return Rider.findOneAndUpdate(
        {
          employed: false,
          'account.subaccount_id': { $exists: true, $ne: null },
        },
        { employed: true },
        { new: true }
      );
    };

    getDispatchRider()
      .then(async (rider) => {
        if (!rider) {
          await req.flash('error', { msg: "Can't find Dispatch Rider" });

          const { returnTo } = req.session;
          delete req.session.returnTo;
          return res.redirect(returnTo || '/error?error=verifying_payment');
        }

        return updateShop(response.data.meta.shop_id, rider._id);
      })
      .then(async (shop) => {
        if (!shop) {
          await req.flash('error', { msg: "Couldn't update Shop" });

          const { returnTo } = req.session;
          delete req.session.returnTo;
          return res.redirect(returnTo || '/error?error=verifying_payment');
        }

        console.log('shop paid for successfully! =>', shop);

        res.redirect(`/shops/dashboard`);
      })
      .catch((err) => {
        console.log(err);

        const { returnTo } = req.session;
        delete req.session.returnTo;
        return res.redirect(returnTo || '/error?error=verifying_payment');
      });
  } catch (err) {
    console.log('Error verying payment for shop\n', err);
    return next(err);
  }
}

module.exports = {
  async pay(req, res) {
    const { data, type } = req.body;

    // Add reason to redirect '&reason=no-type' or flash message!
    if (!data || !type)
      return res.redirect(`/error?error=payment_failed&type=${type}`);

    const validationErrors = [];

    if (validator.isEmpty(type || ''))
      validationErrors.push({ msg: 'Payment Type not found!' });

    if (validator.isEmpty(data.tx_ref || ''))
      validationErrors.push({ msg: 'Transaction Ref not found!' });

    if (!data.amount)
      validationErrors.push({ msg: 'Payment Amount not found!' });

    if (validator.isEmpty(data.currency || ''))
      validationErrors.push({ msg: 'Payment Currency not found!' });

    if (validationErrors.length) {
      validationErrors.forEach(async (err) => {
        await req.flash('error', err);
      });

      const { returnTo } = req.session;
      delete req.session.returnTo;
      return res.redirect(returnTo || '/error?error=making_payment');
    }

    const post = bent('https://api.flutterwave.com/v3/', 'POST', 'json', 200);

    let response;

    try {
      response = await post('payments', data, {
        Authorization: `Bearer ${process.env.FW_SECRET_KEY.trim()}`,
      });

      if (!response) {
        const { returnTo } = req.session;
        delete req.session.returnTo;
        return res.redirect(
          returnTo || `/error?error=making_payment&type=${type}`
        );
      }

      console.log(response);

      if (response.data.link) return res.redirect(`${response.data.link}`);
    } catch (err) {
      console.log('Error paying for shop\n', err);
      return res.status(400).send({ msg: 'Error paying for shop :(', err });
    }
  },

  async verify(req, res, next) {
    try {
      const { transaction_id, tx_ref, type, amount, currency } = req.query;

      const validationErrors = [];

      if (validator.isEmpty(transaction_id || ''))
        validationErrors.push({ msg: 'Transaction ID not found!' });

      if (validator.isEmpty(tx_ref || ''))
        validationErrors.push({ msg: 'Transaction Ref not found!' });

      if (validator.isEmpty(type || ''))
        validationErrors.push({ msg: 'Payment Type not found!' });

      if (validator.isEmpty(amount || ''))
        validationErrors.push({ msg: 'Payment Amount not found!' });

      if (validator.isEmpty(currency || ''))
        validationErrors.push({ msg: 'Payment Currency not found!' });

      if (validationErrors.length) {
        validationErrors.forEach(async (err) => {
          await req.flash('error', err);
        });

        const { returnTo } = req.session;
        delete req.session.returnTo;
        return res.redirect(returnTo || '/error?error=verifying_payment');
      }

      const post = bent('https://api.flutterwave.com/v3/', 'GET', 'json', 200);

      let response;

      try {
        response = await post(`transactions/${transaction_id}/verify`, null, {
          Authorization: `Bearer ${process.env.FW_SECRET_KEY.trim()}`,
        });

        // TODO: verify amount!!!
        //           response.data.amount != amount || get the integer part only!

        // TODO: IF ANY OF THE VERIFICATION OR PAYMENT STEPS FAIL, PLEASE
        // ALLOW THE USER TO [[ TRY AGAIN ]]

        if (
          response.data.status != 'success' ||
          response.data.tx_ref != tx_ref ||
          response.data.id != transaction_id ||
          response.data.currency != currency
        ) {
          // update shop and redirect user to shop home...
          const { returnTo } = req.session;
          delete req.session.returnTo;

          await req.flash('error', { msg: `Could not verify paymenr :/` });

          return res.redirect(returnTo || '/error?error=verifying_payment');
        }

        console.log('response =>', response);

        res.locals.transaction_response = response;

        switch (type) {
          case 'shop_payment':
            return handleShopPayment(req, res, next);
          case 'product_payment':
            return handleProductPayment(req, res, next);

          default:
            return res.redirect(
              '/error?error=verifying_payment&reason=no_type_provided'
            );
        }
      } catch (err) {
        console.log('Error paying for shop\n', err);

        // if (err.code == 'ENOTFOUND' || res.status < 200 || res.status > 299) {
        //   // this was a network issue...
        //   // do the verification again!

        //   const tries = (parseInt(req.query.tries) || 1) + 1;

        //   console.log('Trying again!');

        //   return res.redirect(`${req.get('Referer')}&tries=${tries}`);
        //   // await req.flash('error', { msg: `Please try again! ` });
        // }

        const { returnTo } = req.session;
        delete req.session.returnTo;

        await req.flash('error', { msg: `Error verifying tnx ${err}` });

        return res.redirect(returnTo || '/error?error=verifying_payment');
      }
    } catch (err) {
      return next(err);
    }
  },
};
