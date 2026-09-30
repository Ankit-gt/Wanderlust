const User = require("../models/user.js");

module.exports.renderSignupForm = async (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

module.exports.signup = async (req, res, next) => {
  try {
    let { username, password, email } = req.body;
    let newUser = new User({
      username: username,
      email: email,
    });

    let registerdUser = await User.register(newUser, password);

    req.login(registerdUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", `Welcome ${username} to WanderLust!!!`);
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.login = async (req, res) => {
  let { username } = req.body;
  req.flash("success", `Welcome  ${username} !!!`);
  const redirectUrl = res.locals.redirectUrl || "/listings";
  delete req.session.redirectUrl;
  res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", " You are logged out");
    res.redirect("/listings");
  });
};
