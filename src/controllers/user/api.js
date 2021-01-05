/* eslint-disable no-underscore-dangle */
// const nodemailer = require('nodemailer');
const passport = require('passport');
const validator = require('validator');
// const { store } = require('../../server');
// const mailChecker = require('mailchecker');
// const mailer = require('../../utils/mailer');
const User = require('../../models/user');

// const randomBytesAsync = promisify(crypto.randomBytes);

// const getHtml = promisify(ejs.renderFile);

module.exports = (() => {
  return {
    /**
     * POST api/signin
     * Sign in using email and password.
     */
    async login(req, res, next) {
      // check if already authenticated
      if (req.isAuthenticated()) {
        await req.flash('error', {
          msg: 'Sign out first, before you signin again.',
        });
        return res.redirect('/signin');
      }

      const validationErrors = [];

      if (validator.isEmpty(req.body.email))
        validationErrors.push({ msg: 'Email cannot be blank.' });
      if (!validator.isEmail(req.body.email))
        validationErrors.push({ msg: 'Please enter a valid email address.' });
      if (validator.isEmpty(req.body.password))
        validationErrors.push({ msg: 'Password cannot be blank.' });

      if (validationErrors.length) {
        validationErrors.forEach(async (err) => {
          await req.flash('error', err);
        });

        return res.redirect('/signin');
      }

      req.body.email = validator.normalizeEmail(req.body.email, {
        gmail_remove_dots: false,
      });

      passport.authenticate('local', async (err, user, info) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          console.log(info);
          await req.flash('error', info);
          return res.redirect('/signin');
        }
        req.logIn(user, async (err) => {
          if (err) {
            return next(err);
          }
          await req.flash('success', { msg: 'Success! You are logged in.' });
          req.session.loggedIn = new Date();

          req.session.save(async (err) => {
            if (err) {
              await req.flash('error', { msg: 'Error creating session!' });
            } else {
              console.log('qs', req.session.returnTo);
              const { returnTo } = req.session;
              delete req.session.returnTo;
              // User has been logged in
              // TODO: You can save the return to in the session :) req.session.returnTo
              res.redirect(returnTo || '/');
            }
          });
        });
      })(req, res, next);
    },

    /**
     * POST api/signup
     *
     * @param {*} req
     * @param {*} res
     * @param {*} next
     */
    async signup(req, res, next) {
      const validationErrors = [];
      if (!validator.isEmail(req.body.email))
        validationErrors.push({ msg: 'Please enter a valid email address.' });
      if (!validator.isLength(req.body.password, { min: 8 }))
        validationErrors.push({
          msg: 'Password must be at least 8 characters long',
        });
      // TODO: Add validation for phonenumber and the other fields...
      if (req.body.password !== req.body.confirmPassword)
        validationErrors.push({ msg: 'Passwords do not match' });

      if (validationErrors.length) {
        await req.flash('error', validationErrors);
        return res.redirect('/signup');
      }
      req.body.email = validator.normalizeEmail(req.body.email, {
        gmail_remove_dots: false,
      });

      return next();
    },

    async saveUser(req, res, next) {
      const user = new User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        phonenumber: req.body.phonenumber,
        email: req.body.email,
        password: req.body.password,
      });

      User.findOne({ email: req.body.phonenumber })
        .exec()
        .then(async (existingUser) => {
          if (existingUser) {
            await req.flash('error', {
              msg: 'Account with that phonumber already exists.',
            });
            return res.redirect('/signup');
          }
          // if not move on!
          user.save((err) => {
            if (err) {
              return next(err);
            }

            req.body.user = user;

            return next();
          });
        })
        .catch((err) => {
          return next(err);
        });
    },

    async saveSession(req, res) {
      req.session.save(async (err) => {
        if (err) {
          await req.flash('error', { msg: 'Error creating session!' });
        } else {
          // Now send welcome email :)
          console.log(req.session.returnTo);
          const { returnTo } = req.session;
          req.session.returnTo = false;
          res.redirect(returnTo || '/');
        }
      });
    },

    async isAuthenticated(req, res, next) {
      if (!req.isAuthenticated()) {
        await req.flash('error', {
          msg: 'You need to be signed in first',
        });

        req.session.returnTo = req.originalUrl;

        return res.redirect('/signin');
      }

      return next();
    },

    loginNewUser(req, res, next) {
      req.logIn(req.body.user, (err) => {
        if (err) {
          return next(err);
        }

        // Logged in successfullY!
        return next();
      });
    },
    relogin(req, res, next) {
      if (!req.user._id) {
        // user needs to login again...
        // logout, login, then returnTo shop home
        req.logout();
        req.user = undefined;
        req.session.user = null;

        const { returnTo } = req.session;
        delete req.session.returnTo;
        return res.redirect(returnTo || '/');
      }

      // add alerts here

      User.findById(req.user._id)
        .then((user) => {
          if (!user) {
            req.logout();
            req.user = undefined;
            req.session.user = null;

            const { returnTo } = req.session;
            delete req.session.returnTo;

            return res.redirect(returnTo || '/');
          }

          req.logIn(user, (err) => {
            if (err) {
              req.logout();

              req.user = undefined;
              req.session.user = null;

              const { returnTo } = req.session;
              delete req.session.returnTo;
              return res.redirect(returnTo || '/');
            }

            // Logged in successfullY!
            return next();
          });
        })
        .catch((err) => {
          return next(err);
        });
    },
    logout(req, res) {
      req.logout();
      // console.log(store);

      req.session.destroy((err) => {
        if (err) {
          console.log(
            'Error : Failed to destroy the session during logout.',
            err
          );
        }
        res.clearCookie('jumga.sid', { path: '/' });
        req.user = undefined;
        // store.destroy(req.sessionID, (err) => {
        //   if (err) {
        //     throw new Error('Error in destroying Session');
        //   } else {
        //     return res.status(200).send('Client logged out successfully');
        //   }
        // });
        // res.redirect('/');
        // console.log('returnTo => ', req.session.returnTo);
        // const { returnTo } = req.session;
        // delete req.session.returnTo;
        // User has been logged in
        // TODO: You can save the return to in the session :) req.session.returnTo
        return res.redirect('/');

        // return res.status(200).send('Client logged out successfully');
      });
    },
  };
})();
