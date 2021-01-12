const validator = require('validator').default;
const Country = require('../../models/country');
const Category = require('../../models/category');
const { slugify } = require('../../tools');

module.exports = {
  getCategories(req, res) {
    Category.find({})
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

  setUserCountry(req, res) {
    req.session.country = req.body.country;
    return res.status(200).send('country has been set');
  },
};
