module.exports = (() => {
  return {
    renderSignin(req, res) {
      console.log('returnTo from sign in => ', req.session.returnTo);
      res.render('signin');
    },

    renderSignup(req, res) {
      res.render('signup');
    },
  };
})();
