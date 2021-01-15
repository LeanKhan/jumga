const validator = require('validator').default;
const Country = require('../../models/country');
const Category = require('../../models/category');
const { slugify } = require('../../tools');

module.exports = {
  getCategories(req, res) {
    Category.find({})
      .lean()
      .exec()
      .then((categories) => {
        return res.status(200).json({
          success: true,
          msg: 'Categories Fetched succesffulY!',
          data: categories,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          msg: 'Could not fetch Categories',
          err,
        });
      });
  },
  getCountries(req, res) {
    Country.find({})
      .lean()
      .exec()
      .then((countries) => {
        return res.status(200).json({
          success: true,
          msg: 'Countries Fetched succesffulY!',
          data: countries,
        });
      })
      .catch((err) => {
        return res.status(400).json({
          success: false,
          msg: 'Could not fetch Countries',
          err,
        });
      });
  },

  addCategory(req, res) {
    //   create category...
    try {
      const validationErrors = [];

      if (validator.isEmpty(req.body.name || ''))
        validationErrors.push({ msg: 'Category Name cannot be blank.' });

      if (validator.isEmpty(req.body.item_name_singular || ''))
        validationErrors.push({
          msg: 'Category item_name_singular cannot be blank',
        });

      if (validator.isEmpty(req.body.item_name_plural || ''))
        validationErrors.push({
          msg: 'Category item_name_plural cannot be blank',
        });

      if (validationErrors.length) {
        validationErrors.forEach(async (err) => {
          await req.flash('error', err);
        });

        return res.status(400).send({
          success: false,
          msg: 'Something went wrong while trying to add Category :/',
          alerts: validationErrors,
        });
      }

      const slug = slugify(req.body.name);

      const category = new Category({
        name: req.body.name,
        item_name_singular: req.body.item_name_singular,
        item_name_plural: req.body.item_name_plural,
        slug,
      });

      return Category.findOne({
        slug,
      })
        .lean()
        .exec()
        .then(async (existingCategory) => {
          if (existingCategory) {
            await req.flash('error', {
              msg: 'Category with similar name already exists!',
            });

            return res.status(400).send({
              success: false,
              msg: 'Category with similar name already exists!',
            });
          }
          // if not move on!

          category.save((err, c) => {
            if (err) {
              return res.status(400).send(err);
            }

            return res.status(200).send({
              success: true,
              msg: 'Category added successfully!',
              data: c,
            });
          });
        });
    } catch (err) {
      console.error('Something went wrong while adding Category :/\n', err);

      return res.status(400).send({
        success: false,
        msg: 'Something went wrong while trying to add Category :/',
        data: err,
      });
    }
  },
  addCountry(req, res) {
    //   create Country...
    try {
      const validationErrors = [];

      if (validator.isEmpty(req.body.name || ''))
        validationErrors.push({ msg: 'Country Name cannot be blank.' });

      if (validator.isEmpty(req.body.short_code || ''))
        validationErrors.push({ msg: 'Country Short Code cannot be blank' });

      if (validator.isEmpty(req.body.currency_code || ''))
        validationErrors.push({ msg: 'Country Currency Code cannot be blank' });

      if (validator.isEmpty(req.body.dollar_exchange_rate || ''))
        validationErrors.push({
          msg: 'Country Dollar Exchange Rate cannot be blank',
        });

      if (validator.isEmpty(req.body.phonenumber_code || ''))
        validationErrors.push({
          msg: 'Country Phonenumber Code cannot be blank',
        });

      if (validationErrors.length) {
        validationErrors.forEach(async (err) => {
          await req.flash('error', err);
        });

        return res.status(400).send({
          success: false,
          msg: 'Something went wrong while trying to add Country :/',
          alerts: validationErrors,
        });
      }

      const country = new Country({
        name: req.body.name,
        short_code: req.body.short_code, // NG
        currency_code: req.body.currency_code, // NGN
        dollar_exchange_rate: req.body.dollar_exchange_rate, // 380
        phonenumber_code: req.body.phonenumber_code,
      });

      return Country.findOne({
        short_code: req.body.short_code,
      })
        .lean()
        .exec()
        .then(async (existingCountry) => {
          if (existingCountry) {
            await req.flash('error', {
              msg: 'Country with similar name already exists!',
            });

            return res.status(400).send({
              success: false,
              msg: 'Country with similar name already exists!',
            });
          }
          // if not move on!

          country.save((err, c) => {
            if (err) {
              return res.status(400).send(err);
            }

            return res.status(200).send({
              success: true,
              msg: 'Country added successfully!',
              data: c,
            });
          });
        });
    } catch (err) {
      console.error('Something went wrong while adding Country :/\n', err);

      return res.status(400).send({
        success: false,
        msg: 'Something went wrong while trying to add Country :/',
        data: err,
      });
    }
  },

  async updateCountry(req, res) {
    try {
      const { id } = req.params;
      const { update } = req.body;

      // move all these to middlware! Thank you Jesus!

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
          msg: 'You have to be signed in as an Admin! to do this!',
        });
        return res
          .status(401)
          .send({ success: false, msg: 'UNAUTHORISEEEED!' });
      }

      if (!id)
        return res
          .status(404)
          .send({ success: false, msg: 'NO ID or SLUG SENT!!' });
      if (!update)
        return res
          .status(404)
          .send({ success: false, msg: 'NO UPDATE SENT!!' });

      Country.findByIdAndUpdate(id, update, { new: true })
        .lean()
        .exec()
        .then((country) => {
          console.log('Country updated successfully!');

          return res.status(200).send({
            success: true,
            msg: 'Country Updated successfully!',
            data: country,
          });
        })
        .catch((err) => {
          console.log('Erro updaitn country! -=>', err);
          return res.status(400).send({
            success: false,
            msg: 'Error updating country!',
            error: err.message,
          });
        });
    } catch (error) {
      console.error('Error updating Country! => ', error);
      return res.status(400).send({
        success: false,
        msg: 'Error updating country!',
        error: error.message,
      });
    }
  },

  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { update } = req.body;

      // move all these to middlware! Thank you Jesus!

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
          msg: 'You have to be signed in as an Admin! to do this!',
        });
        return res
          .status(401)
          .send({ success: false, msg: 'UNAUTHORISEEEED!' });
      }

      if (!id)
        return res
          .status(404)
          .send({ success: false, msg: 'NO ID or SLUG SENT!!' });
      if (!update)
        return res
          .status(404)
          .send({ success: false, msg: 'NO UPDATE SENT!!' });

      Category.findByIdAndUpdate(id, update, { new: true })
        .lean()
        .exec()
        .then((category) => {
          console.log('Category updated successfully!');

          return res.status(200).send({
            success: true,
            msg: 'Category Updated successfully!',
            data: category,
          });
        })
        .catch((err) => {
          console.log('Erro updaitn category! -=>', err);
          return res.status(400).send({
            success: false,
            msg: 'Error updating category!',
            error: err.message,
          });
        });
    } catch (error) {
      console.error('Error updating Category! => ', error);
      return res.status(400).send({
        success: false,
        msg: 'Error updating category!',
        error: error.message,
      });
    }
  },

  setUserCountry(req, res) {
    req.session.country = req.body.country;
    return res.status(200).send({ success: true, msg: 'country has been set' });
  },
};
