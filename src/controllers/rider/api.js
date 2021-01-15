const validator = require('validator');
const fetch = require('node-fetch');
// const qs = require('querystring');
const Rider = require('../../models/dispatch_rider');
const Shop = require('../../models/shop');

module.exports = (() => {
  return {
    async addRider(req, res, next) {
      try {
        if (!req.isAuthenticated()) {
          await req.flash('error', {
            msg: 'You have to be signed in to open add Dispatch Rider',
          });
          return res.redirect('/signin?returnTo=%2Fadmin%2Fdashboard');
        }

        const validationErrors = [];

        if (validator.isEmpty(req.body.rider.firstname || ''))
          validationErrors.push({ msg: 'First Name cannot be blank.' });

        if (validator.isEmpty(req.body.rider.lastname || ''))
          validationErrors.push({ msg: 'ast Name cannot be blank' });

        if (validationErrors.length) {
          validationErrors.forEach(async (err) => {
            await req.flash('error', err);
          });

          if (req.xhr)
            return res.status(400).json({
              success: false,
              msg: 'Missing Values! For adding Dispatch Rider',
              alerts: validationErrors,
            });

          return res.redirect(req.get('Referer') || '/admin/dashboard');
        }

        const rider = new Rider({
          firstname: req.body.rider.firstname,
          lastname: req.body.rider.lastname,
          picture: req.body.rider.picture,
          phonenumber: req.body.rider.phonenumber,
          account: {
            bank: '044',
            account_number: req.body.rider.account.account_number,
            account_name: req.body.rider.account.account_name,
            country: req.body.rider.account.country,
            currency: req.body.rider.account.currency,
          },
        });

        return Rider.findOne({
          firstname: req.body.rider.firstname,
          lastname: req.body.rider.lastname,
        })
          .lean()
          .exec()
          .then(async (existingRider) => {
            if (existingRider) {
              await req.flash('error', {
                msg: 'Rider with similar name already exists!',
              });

              if (req.xhr)
                return res.status(400).json({
                  success: false,
                  msg:
                    'Missing Values! For Adding Sub account for Dispatch Rider',
                  error: { msg: 'Rider with similar naem already exists!' },
                });

              return res.redirect('/admin/dashboard');
            }
            // if not move on!

            rider.save((err, r) => {
              if (err) {
                next(err);
                return res.status(400).send(err);
              }

              req.body.rider = r;
              return next();
              // return res.render('admin/dashboard');
            });
          });
      } catch (error) {
        console.error('Something went wrong :/\n', error);

        await req.flash('error', { msg: 'Smething went wrong!' });

        if (req.xhr)
          return res.status(400).json({
            success: true,
            msg: 'Error adding Dispatch Rider¬',
            error: error.message,
          });

        return res.redirect(req.get('Referer') || '/admin/dashboard');
      }
    },

    async createSubaccount(req, res) {
      try {
        if (!req.isAuthenticated()) {
          await req.flash('error', {
            msg: 'You have to be signed in to open a Shop',
          });
          return res.redirect('/signin?returnTo=%2Fadmin%2Fdashboard');
        }

        // check if shop exists actually...

        const validationErrors = [];

        if (validator.isEmpty(req.body.rider.account.account_name || ''))
          validationErrors.push({ msg: 'Account Name cannot be blank.' });

        if (validator.isEmpty(req.body.rider.account.account_number || ''))
          validationErrors.push({ msg: 'Please provide an Account Number' });

        if (validationErrors.length) {
          validationErrors.forEach(async (err) => {
            await req.flash('error', err);
          });

          // if this is XHR then send this...

          if (req.xhr)
            return res.status(400).json({
              success: false,
              msg: 'Missing Values! For Adding Sub account for Dispatch Rider',
              alerts: validationErrors,
            });

          return res.redirect(req.get('Referer') || '/admin/dashboard');
        }

        const updateRider = async (response) => {
          console.log(response);

          if (response.status != 'success') {
            await req.flash('error', { msg: response.message });
            throw new Error(JSON.stringify(response));
          }

          return Rider.findOneAndUpdate(
            { _id: req.body.rider._id },
            {
              'account.subaccount_id': response.data.subaccount_id,
              'account.full_name': response.data.full_name,
            },
            { new: true }
          )
            .lean()
            .exec();
        };

        const data = req.body.rider;

        const payload = JSON.stringify({
          //   get it from request body
          account_bank: '044',
          account_number: data.account.account_number.trim(),
          business_name: `${data.firstname
            .trim()
            .toLowerCase()}-${data.lastname.trim().toLowerCase()}`,
          business_contact: `${data.firstname
            .trim()
            .toLowerCase()} ${data.lastname.trim().toLowerCase()}`,
          business_contact_mobile: data.phonenumber,
          business_mobile: data.phonenumber.trim(),
          business_email: `dispatchriders@jumga.store`,
          country: data.account.country.trim().toUpperCase(),
          meta: [
            { meta_name: 'account_type', meta_value: 'dispatch_rider' },
            { meta_name: '_id', meta_value: `${data._id}` },
          ],
          split_type: 'percentage',
          split_value: 0.8,
        });

        fetch('https://api.flutterwave.com/v3/subaccounts', {
          method: 'post',
          body: payload,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.FW_SECRET_KEY.trim()}`,
          },
        })
          .then((res) => res.json())
          .then(updateRider)
          .then(async (rider) => {
            console.log('updated rider =>\n', rider);

            await req.flash('success', {
              msg: 'Dispatch Rider added successfully!',
            });

            if (req.xhr)
              return res.status(200).json({
                success: true,
                msg: 'Dispatch Rider added successfully!',
                data: rider,
              });

            return res.redirect(req.get('Referer') || '/admin/dashboard');
          })
          .catch(async (error) => {
            // TODO: stop repeating messages!
            console.error(error);
            await req.flash('error', {
              msg:
                'Could not create Sub Account for Dispatch rider, please try again!',
            });

            if (req.xhr)
              return res.status(400).json({
                success: false,
                msg:
                  'Could not create Sub Account for Dispatch rider, please try again!',
                error: error.message,
              });

            return res.redirect(req.get('Referer') || '/admin/dashboard');
          });
      } catch (error) {
        console.error('Something went wrong :/\n', error);
        await req.flash('error', {
          msg:
            'Could not create Sub Account for Dispatch rider, please try again!',
        });

        if (req.xhr)
          return res.status(400).json({
            success: false,
            msg:
              'Could not create Sub Account for Dispatch rider, please try again!',
            error: error.message,
          });

        return res.redirect(req.get('Referer') || '/admin/dashboard');
      }
    },

    getRiders(req, res) {
      Rider.find({})
        .lean()
        .exec()
        .then((riders) => {
          return res.status(200).json({
            success: true,
            msg: 'Dispatch Riders Fetched succesffulY!',
            data: riders,
          });
        })
        .catch((error) => {
          return res.status(400).json({
            success: false,
            msg: 'Could not fetch Dispatch Riders',
            error,
          });
        });
    },
    getRider(req, res) {
      let select;
      if (req.query.select) {
        console.log('Select these!', req.query.select);
        select = req.query.select.replace(/,/g, ' ');
      }

      const getter = () => {
        if (select) {
          return Rider.findById(req.params.id).select(select).lean().exec();
        }

        return Rider.findById(req.params.id).lean().exec();
      };

      getter()
        .then((rider) => {
          return res.status(200).json({
            success: true,
            msg: 'Dispatch Rider Fetched succesffuly!',
            data: rider,
          });
        })
        .catch((error) => {
          return res.status(400).json({
            success: false,
            msg: 'Could not fetch Dispatch Rider',
            error,
          });
        });
    },
    async updateRider(req, res) {
      try {
        const { id } = req.params;
        const { update } = req.body;

        if (!req.user.isAdmin) {
          await req.flash('error', {
            msg: 'Only Admins can do this!',
          });
          return res
            .status(401)
            .send({ success: false, msg: 'UNAUTHORISEEEED!' });
        }

        if (!req.isAuthenticated()) {
          await req.flash('error', {
            msg: 'You have to be signed in as an Admin!',
          });
          return res
            .status(401)
            .send({ success: false, msg: 'UNAUTHORISEEEED!' });
        }

        if (!id)
          return res
            .status(404)
            .send({ success: false, msg: 'NO DISPATCH RIDER ID SENT!!' });
        if (!update)
          return res
            .status(404)
            .send({ success: false, msg: 'NO UPDATE SENT!!' });

        /** Remove unwanted properties */
        delete update.account_number;
        delete update.account_name;
        delete update.bank;
        delete update.country;

        Rider.findByIdAndUpdate(id, update, { new: true })
          .lean()
          .exec()
          .then((rider) => {
            console.log('Dispatch Rider updated successfully!');

            return res.status(200).send({
              success: true,
              msg: 'Dispatch Rider Updated successfully!',
              data: rider,
            });
          })
          .catch((err) => {
            console.log('Erro updaitn Rider! -=>', err);
            return res.status(400).send({
              success: false,
              msg: 'Error updating Rider!',
              error: err.message,
            });
          });
      } catch (error) {
        console.error('Error updating Rider! => ', error);
        return res.status(400).send({
          success: false,
          msg: 'Error updating Rider!',
          error: error.message,
        });
      }
    },
    assignToShop(req, res) {
      // find a random shop and give the Dispatch Rider to them...

      const { id } = req.params;

      const updateShop = (rider_id) => {
        return Shop.findOneAndUpdate(
          { dispatch_rider: { $exists: false, $eq: null } },
          { dispatch_rider: rider_id }
        )
          .lean()
          .exec();
      };

      const findRider = () => {
        return Rider.findOne({
          _id: id,
          employed: false,
          'account.subaccount_id': { $exists: true },
        })
          .lean()
          .exec();
      };

      const updateRider = (shop) => {
        if (!shop) throw new Error('Cannot find shop to assign Rider to!');
        return Rider.findByIdAndUpdate(id, { employed: true, shop: shop._id })
          .lean()
          .exec();
      };

      findRider()
        .then((rider) => {
          if (!rider) {
            // shit
            return res.status(400).json({
              success: false,
              msg: "Dispatch Rider either doesn't exist or already has a Shop!",
            });
          }

          return updateShop(rider._id);
        })
        .then(updateRider)
        .then((r) => {
          console.log(
            `Dispatch Rider ${r.firstname} assigned to Shop successfully!`
          );
          return res.status(200).json({
            success: true,
            msg: 'Dispatch Rider Added to shop!',
          });
        })
        .catch((err) => {
          console.log('shit: could not assign dispatch rider to Shop', err);
          return res.status(400).json({
            success: false,
            msg: 'Error assigning Dispatch Rider to Shop',
            error: err.message,
          });
        });
    },
  };
})();
