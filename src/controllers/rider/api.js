const validator = require('validator');
const fetch = require('node-fetch');
const Rider = require('../../models/dispatch_rider');

module.exports = (() => {
  return {
    async addRider(req, res, next) {
      try {
        if (!req.isAuthenticated()) {
          await req.flash('error', {
            msg: 'You have to be signed in to open a Shop',
          });
          return res.redirect('/signin?returnTo=%2Fadmin%2Fdashboard');
        }

        const validationErrors = [];

        if (validator.isEmpty(req.body.firstname || ''))
          validationErrors.push({ msg: 'First Name cannot be blank.' });

        if (validator.isEmpty(req.body.lastname || ''))
          validationErrors.push({ msg: 'ast Name cannot be blank' });

        if (validationErrors.length) {
          validationErrors.forEach(async (err) => {
            await req.flash('error', err);
          });

          return res.redirect('/admin/dashboard');
        }

        const rider = new Rider({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          picture: req.body.picture,
          phonenumber: req.body.phonenumber,
          account: {
            bank: '044',
            account_number: req.body.account_number,
            account_name: req.body.account_name,
            country: req.body.country,
            currency: req.body.currency,
          },
        });

        return Rider.findOne({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
        })
          .exec()
          .then(async (existingRider) => {
            if (existingRider) {
              await req.flash('error', {
                msg: 'Rider with similar name already exists!',
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

        return res.redirect(
          '/error?c=something_went_wrong&where=addding_rider'
        );
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

        if (validator.isEmpty(req.body.account_name || ''))
          validationErrors.push({ msg: 'Account Name cannot be blank.' });

        if (validator.isEmpty(req.body.account_number || ''))
          validationErrors.push({ msg: 'Please provide an Account Number' });

        if (validationErrors.length) {
          validationErrors.forEach(async (err) => {
            await req.flash('error', err);
          });

          return res.redirect('/admin/dashboard');
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
          );
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
          .then((rider) => {
            console.log('updated rider =>\n', rider);
            return res.redirect('/admin/dashboard');
          })
          .catch((err) => {
            console.error(err);
            return res.redirect('/admin/dashboard?error=rider_addition_failed');
          });
      } catch (error) {
        console.error('Something went wrong :/\n', error);

        return res.redirect(
          '/error?c=something_went_wrong&where=addding_rider_subaccount'
        );
      }
    },
  };
})();
