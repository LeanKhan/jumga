/* eslint-disable no-underscore-dangle */
const passport = require('passport');
const { Strategy: LocalStrategy } = require('passport-local');
const User = require('../models/user');

passport.serializeUser((user, done) => {
  const sessionUser = {
    _id: user._id,
    firstname: user.firstname,
    lastname: user.lastname,
    isAdmin: user.isAdmin,
    hasShop: user.hasShop,
  };
  done(null, sessionUser);
});

passport.deserializeUser((sessionUser, done) => {
  done(null, sessionUser);
  // User.findById(id, (err, user) => {
  //   done(err, user);
  // });
});

/**
 * Sign in using Email and Password.
 */
passport.use(
  new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: email.trim().toLowerCase() }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (!user) {
        return done(null, false, { msg: `Email ${email} not found.` });
      }
      if (!user.password) {
        return done(null, false, {
          msg:
            'Your account was registered using a sign-in provider. To enable password login, sign in using a provider, and then set a password under your user profile.',
        });
      }
      user.comparePassword(password, (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (isMatch) {
          return done(null, user);
        }
        return done(null, false, { msg: 'Invalid email or password.' });
      });
    });
  })
);

/**
 * Login Required middleware.
 */
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  if (req.xhr) {
    return res.send({ authenticated: false, message: 'Not authenticated!' });
  }

  req.flash('errors', { msg: 'Hey, you need to be logged in :)' });

  res.redirect('/signin');
};
