/* eslint-disable no-underscore-dangle */
const bent = require('bent');
const validator = require('validator').default;
const Shop = require('../../models/shop');
const Rider = require('../../models/dispatch_rider');
const Transaction = require('../../models/transaction');
const Message = require('../../models/message');
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
      )
        .lean()
        .exec();
    };

    const getDispatchRider = () => {
      return Rider.findOne({
        employed: false,
        'account.subaccount_id': { $exists: true, $ne: null },
      })
        .lean()
        .exec();
    };

    const updateRider = (shop) => {
      if (!shop) throw new Error('Cannot find shop to assign Rider to!');
      return Rider.findByIdAndUpdate(
        shop.dispatch_rider,
        {
          employed: true,
          shop: shop._id,
        },
        { new: true }
      )
        .lean()
        .exec();
    };

    const current_shop = await Shop.findOne({
      _id: response.data.meta.shop_id.trim(),
    }).exec();

    if (current_shop.dispatch_rider) {
      console.log('Already have a Dispatch Rider , thank you :)');

      return updateShop(
        response.data.meta.shop_id.trim(),
        current_shop.dispatch_rider
      )
        .then(async () => {
          console.log('Shop paid for successfully!');
          await req.flash('success', {
            msg: 'Shop Payment verified!',
          });

          res.redirect(`/shops/dashboard`);
        })
        .catch((err) => {
          throw err;
        });
    }

    getDispatchRider()
      .then(async (rider) => {
        console.log(rider);
        if (!rider) {
          await req.flash('error', { msg: "Can't find Dispatch Rider" });

          console.log('Dispatch Rider not assigned -- send message to Admin!');

          // const { returnTo } = req.session;
          // delete req.session.returnTo;
          // return res.redirect(returnTo || '/error?error=verifying_payment');
          const msg = {
            from: response.data.meta.shop_id.trim(),
            message: `This shop does not have a Dispatch Rider! Please give them one o`,
            message_type: 'no_dispatch_rider',
          };
          await Message.create(msg);
          return updateShop(response.data.meta.shop_id.trim(), null);
        }

        return updateShop(response.data.meta.shop_id.trim(), rider._id);
      })
      .then(updateRider)
      .then(async (rider) => {
        if (!rider) {
          await req.flash('error', {
            msg: "Couldn't update Shop. Please try again or message the admin",
          });

          const { returnTo } = req.session;
          delete req.session.returnTo;
          return res.redirect(returnTo || '/shops/dashboard');
        }

        await req.flash('success', {
          msg: 'Shop Payment verified!',
        });

        console.log('shop paid for successfully!');

        const { returnTo } = req.session;
        delete req.session.returnTo;
        return res.redirect(returnTo || '/shops/dashboard');
      })
      .catch(async (err) => {
        console.log(err);
        await req.flash('error', {
          msg:
            "Couldn't add Dispatch Rider. Please try again or message the admin",
        });

        const { returnTo } = req.session;
        delete req.session.returnTo;
        return res.redirect(returnTo || '/error?error=verifying_payment');
      });
  } catch (err) {
    console.log('Error verying payment for shop\n', err);
    await req.flash('error', {
      msg: "Couldn't update Shop. Please try again or message the admin",
    });
    return next(err);
  }
}

module.exports = {
  async pay(req, res) {
    const { data, type } = req.body;

    const shop_id = req.body.shop_id.trim();

    console.log('Here befroe fw pay endpoint');

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

      const tx = {
        actor: type == 'shop_payment' ? 'Shop' : 'Customer',
        tx_ref: data.tx_ref,
        shop: shop_id,
        type,
      };

      await Transaction.create(tx);

      if (response.data.link) return res.redirect(response.data.link);

      if (response.meta.authorization.redirect)
        return res.redirect(response.meta.authorization.redirect);

      // for mpesa payments...
      if (response.data.payment_type == 'mpesa')
        return res.redirect(
          `/payments/verify?status=${response.data.status}&tx_ref=${response.data.tx_ref}&transaction_id=${response.data.id}&amount=${response.data.amount}&currency=${response.data.currency}&type=${type}`
        );
    } catch (err) {
      console.log('Error paying for shop\n', err);
      return res.status(400).send({ msg: 'Error paying for shop :(', err });
    }
  },

  async beforePay(req, res, next) {
    const { data, type } = req.body;

    const { shop_id } = req.body;

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

    const findTx = (query) => {
      return Transaction.findOne(query).lean().exec();
    };

    // TODO: what if it's a product payment? idk lol
    if (type == 'shop_payment' && shop_id) {
      // find if there's a transaction with this shop
      return findTx({ shop: shop_id, type: 'shop_payment' })
        .then((tx) => {
          if (tx) {
            if (tx.paid && tx.verified) {
              console.log('This has already been paid & verified');
              return res.redirect(req.get('Referer') || '/');
            }

            if (tx.paid && !tx.verified) {
              console.log('Payment has been made, good. Now, just verify!');

              return res.redirect(
                `/payments/verify?status=${tx.transaction.status}&tx_ref=${tx.transaction.tx_ref}&transaction_id=${tx.transaction.id}&amount=${tx.transaction.amount}&currency=${tx.transaction.currency}&type=${type}`
              );
            }
          }

          /**
           * params needed: transaction_id, tx_ref, type, amount, currency
           * http://localhost:3000/payments/verify?status=successful&tx_ref=hooli-tx-1920bbtytty&transaction_id=1811443
           */

          if (!tx) {
            console.log('Payment has not been made, neither verified!');
            console.log('Oya continue :)');

            return next();
          }
        })
        .catch(async (err) => {
          console.log('Error :/ ', err);

          await req.flash('error', {
            msg: 'Error while trying to pay for shop. Please try again',
          });

          return res.redirect('/shops/dashboard');
        });
    }
  },

  async verify(req, res, next) {
    try {
      const {
        transaction_id,
        tx_ref,
        type,
        amount,
        currency,
        status,
      } = req.query;

      if (status == 'cancelled') {
        await req.flash('error', {
          msg: `Cancelled Payment... for ${
            type == 'shop_payment' ? 'Shop' : 'Product'
          }`,
        });
        const redirect = type == 'shop_payment' ? '/shops/dashboard' : '/';
        return res.redirect(redirect);
      }

      const validationErrors = [];

      if (validator.isEmpty(transaction_id || ''))
        validationErrors.push({
          msg: 'Transaction ID not found! [payment verification]',
        });

      if (validator.isEmpty(tx_ref || ''))
        validationErrors.push({
          msg: 'Transaction Ref not found! [payment verification]',
        });

      if (validator.isEmpty(type || ''))
        validationErrors.push({
          msg: 'Payment Type not found! [payment verification]',
        });

      if (validator.isEmpty(amount || ''))
        validationErrors.push({
          msg: 'Payment Amount not found! [payment verification]',
        });

      if (validator.isEmpty(currency || ''))
        validationErrors.push({
          msg: 'Payment Currency not found! [payment verification]',
        });

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
        // console.log(
        //   `${transaction_id}, ${tx_ref}, ${type}, ${amount}, ${currency}`
        // );
        // console.log(response);

        if (
          response.data.status != 'successful' ||
          response.data.tx_ref != tx_ref ||
          response.data.id != transaction_id ||
          response.data.currency != currency
        ) {
          // update shop and redirect user to shop home...
          const { returnTo } = req.session;
          delete req.session.returnTo;

          await Transaction.findOneAndUpdate(
            { tx_ref },
            {
              verified: false,
              transaction: response.data,
            }
          )
            .lean()
            .exec();

          await req.flash('error', { msg: `Could not verify payment :/` });

          return res.redirect(returnTo || '/error?error=verifying_payment');
        }

        console.log('response =>', response);

        res.locals.transaction_response = response;

        console.log('Payment Verified successfully!');

        await Transaction.findOneAndUpdate(
          { tx_ref },
          {
            verified: true,
            paid: true,
            status: 'paid_and_verified',
            transaction: response.data,
          }
        )
          .lean()
          .exec();

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
