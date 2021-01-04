/* eslint-disable no-underscore-dangle */
const bent = require('bent');
const Shop = require('../../models/shop');
const Rider = require('../../models/dispatch_rider');

module.exports = () => {
  return {
    async verifyPayment(req, res) {
      // res.send()
      // verify payment here...

      const updateShop = (shop_id, rider) => {
        return Shop.findOneAndUpdate(
          { _id: shop_id },
          { isApproved: true, hasPaidFee: true, rider },
          { new: true }
        );
      };

      const getDispatchRider = () => {
        return Rider.findOne({ employed: false }).exec();
      };

      const { transaction_id, tx_ref } = req.query;

      const post = bent('https://api.flutterwave.com/v3/', 'GET', 'json', 200);

      let response;

      try {
        response = await post(`transactions/${transaction_id}/verify`, null, {
          Authorization: `Bearer ${process.env.FW_SECRET_KEY.trim()}`,
        });

        if (
          response.data.status != 'success' &&
          response.data.tx_ref != tx_ref &&
          response.data.id != transaction_id &&
          response.data.amount != '20' &&
          response.data.currency != 'USD'
        ) {
          // update shop and redirect user to shop home...
          return res.redirect('/?error=payment_failed');
        }

        console.log(response);

        getDispatchRider()
          .then((rider) => {
            return updateShop(response.data.customer.shop_id, rider);
          })
          .then((shop) => {
            console.log(shop);

            res.redirect(`/shops/${shop._id}/admin`);
          })
          .catch((err) => {
            console.log(err);
            return res.redirect(
              '/error?cause=verifying_payment&cntx=opening_shop'
            );
          });
      } catch (err) {
        console.log('Error paying for shop\n', err);
        return res.status(400).send({ msg: 'Error paying for shop!', err });
      }
    },
  };
};
