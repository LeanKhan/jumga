/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const validator = require('validator').default;
const User = require('../../models/user');

module.exports = {
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

    if (validator.isEmpty(req.body.email || ''))
      validationErrors.push({ msg: 'Email cannot be blank.' });
    if (!validator.isEmail(req.body.email || ''))
      validationErrors.push({ msg: 'Please enter a valid email address.' });
    if (validator.isEmpty(req.body.password || ''))
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
            return res.redirect(returnTo || '/');
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
    if (!validator.isEmail(req.body.email || ''))
      validationErrors.push({ msg: 'Please enter a valid email address.' });
    if (!validator.isLength(req.body.password || '', { min: 8 }))
      validationErrors.push({
        msg: 'Password must be at least 8 characters long',
      });
    // TODO: Add validation for phonenumber and the other fields...
    if (req.body.password !== req.body.confirmPassword)
      validationErrors.push({ msg: 'Passwords do not match' });

    if (validationErrors.length) {
      validationErrors.forEach(async (err) => {
        await req.flash('error', err);
      });

      return res.redirect(req.get('Referer') || '/signup');
    }
    req.body.email = validator.normalizeEmail(req.body.email, {
      gmail_remove_dots: false,
    });

    return next();
  },

  async saveUser(req, res, next) {
    User.findOne({ email: req.body.email })
      .lean()
      .exec()
      .then(async (existingUser) => {
        if (existingUser) {
          await req.flash('error', {
            msg: 'User already has an account!',
          });
          return res.redirect(req.get('Referer') || '/signup');
        }

        const user = new User({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          phonenumber: req.body.phonenumber,
          email: req.body.email,
          password: req.body.password,
        });

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
        delete req.session.returnTo;
        res.redirect(returnTo || '/');
      }
    });
  },

  async isAuthenticated(req, res, next) {
    if (!req.isAuthenticated()) {
      await req.flash('error', {
        msg: 'You need to be signed in first',
      });

      if (req.xhr)
        return res.status(401).json({
          success: false,
          msg: 'Cannot access this resource! You are not Authenticated!',
          error: 'You are not Authenticated!',
          alerts: [{ msg: 'You are not authenticated' }],
        });

      return res.redirect(`/signin?returnTo=${req.originalUrl}`);
    }

    return next();
  },

  async isAdmin(req, res, next) {
    if (!req.isAuthenticated() || !req.user.isAdmin) {
      await req.flash('error', {
        msg: 'You are not admin!',
      });

      if (req.xhr)
        return res.status(401).json({
          success: false,
          msg:
            'Cannot access this resource! You are not Authenticated! For Admins only :)',
          error: 'You are not Authenticated!',
          alerts: [{ msg: 'You are not authenticated' }],
        });

      return res.redirect(`/`);
    }

    return next();
  },

  async isShopOwner(req, res, next) {
    if (!req.isAuthenticated() || !req.user.shop) {
      await req.flash('error', {
        msg: 'You are not a Merchant!',
      });

      if (req.xhr)
        return res.status(401).json({
          success: false,
          msg:
            'Cannot access this resource! You are not Authenticated! For Merchants only!',
          error: 'You are not Authenticated!',
          alerts: [{ msg: 'You are not authenticated' }],
        });

      return res.redirect(`/`);
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

      if (req.xhr)
        return res.status(400).json({
          success: false,
          msg: 'No User ID provided',
        });
      return res.redirect(returnTo || '/');
    }

    // add alerts here

    User.findById(req.user._id)
      .lean()
      .exec()
      .then((user) => {
        if (!user) {
          req.logout();
          req.user = undefined;
          req.session.user = null;

          const { returnTo } = req.session;
          delete req.session.returnTo;

          if (req.xhr)
            return res.status(404).json({
              success: false,
              msg: 'User not found!',
            });

          return res.redirect(returnTo || '/');
        }

        req.logIn(user, async (err) => {
          if (err) {
            req.logout();

            req.user = undefined;
            req.session.user = null;

            const { returnTo } = req.session;
            delete req.session.returnTo;

            if (req.xhr)
              return res.status(400).json({
                success: false,
                msg: 'Error carrying out operation',
                error: err.message,
              });

            return res.redirect(returnTo || '/');
          }

          // Logged in successfullY!

          if (req.query.skipPayment) {
            await req.flash('success', {
              msg: 'Welcome to your new Shop!',
            });

            await req.flash('warning', {
              msg:
                "You can't do much without paying for your shop and adding an account... :p capitalism yunno",
            });

            if (req.xhr)
              return res.status(400).json({
                success: false,
                msg: 'Error carrying out operation',
              });

            delete req.session.returnTo;
            return res.redirect('/shops/dashboard');
          }

          if (res.locals.route_name == 'delete_shop') {
            await req.flash('success', {
              msg: 'Shop deleted succesfully!',
            });

            if (req.xhr)
              return res.status(200).json({
                success: true,
                msg: 'Shop deleted successfuly!',
              });

            delete req.session.returnTo;
            return res.redirect('/');
          }

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
