// const nodemailer = require('nodemailer');
const passport = require('passport');
const validator = require('validator');
// const { store } = require('../../server');
// const mailChecker = require('mailchecker');
// const mailer = require('../../utils/mailer');
const User = require('../../models/user');

// const randomBytesAsync = promisify(crypto.randomBytes);

// const getHtml = promisify(ejs.renderFile);

/**
 * POST api/signin
 * Sign in using email and password.
 */
function login(req, res, next) {
  const validationErrors = [];
  //   if (!validator.isEmail(req.body.email))
  //     validationErrors.push({ msg: 'Please enter a valid email address.' });
  if (validator.isEmpty(req.body.firstname))
    validationErrors.push({ msg: 'Firstname cannot be blank.' });
  if (validator.isEmpty(req.body.lastname))
    validationErrors.push({ msg: 'Lastname cannot be blank.' });
  if (validator.isEmpty(req.body.password))
    validationErrors.push({ msg: 'Password cannot be blank.' });

  if (validationErrors.length) {
    req.flash('errors', validationErrors);
    return res.redirect('/signin');
  }
  //   req.body.email = validator.normalizeEmail(req.body.email, {
  //     gmail_remove_dots: false,
  //   });

  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('errors', info);
      return res.redirect('/signin');
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      req.flash('success', { msg: 'Success! You are logged in.' });
      req.session.loggedIn = new Date();

      req.session.save((err) => {
        if (err) {
          req.flash('errors', { msg: 'Error creating session!' });
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
}

/**
 * POST api/signup
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
function signup(req, res, next) {
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
    req.flash('errors', validationErrors);
    return res.redirect('/signup');
  }
  req.body.email = validator.normalizeEmail(req.body.email, {
    gmail_remove_dots: false,
  });

  return next();
}

function saveUser(req, res, next) {
  const user = new User({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    phonenumber: req.body.phonenumber,
    password: req.body.password,
  });

  User.findOne({ email: req.body.phonenumber })
    .exec()
    .then((existingUser) => {
      if (existingUser) {
        req.flash('errors', {
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
}

function saveSession(req, res) {
  req.session.save((err) => {
    if (err) {
      req.flash('errors', { msg: 'Error creating session!' });
    } else {
      // Now send welcome email :)
      console.log(req.session.returnTo);
      const { returnTo } = req.session;
      req.session.returnTo = false;
      res.redirect(returnTo || '/');
    }
  });
}

function loginNewUser(req, res, next) {
  req.logIn(req.body.user, (err) => {
    if (err) {
      return next(err);
    }

    // Logged in successfullY!
    return next();
  });
}

function logout(req, res) {
  req.logout();
  // console.log(store);
  req.session.destroy((err) => {
    if (err) {
      console.log('Error : Failed to destroy the session during logout.', err);
    }
    req.user = undefined;
    // store.destroy(req.sessionID, (err) => {
    //   if (err) {
    //     throw new Error('Error in destroying Session');
    //   } else {
    //     return res.status(200).send('Client logged out successfully');
    //   }
    // });
    // res.redirect('/');
    res.redirect('/');

    // return res.status(200).send('Client logged out successfully');
  });
}

module.exports = {
  login,
  signup,
  logout,
  loginNewUser,
  saveSession,
  saveUser,
};
