const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const wrapAsync = require("../utils/wrapAync.js");
const User = require("../models/user.js");
const { saveRedirectedUrl } = require("../middleware.js");

router.get("/signup", async (req, res) => {
  res.render("users/signup.ejs");
});

router.post(
  "/signup",
  wrapAsync(async (req, res) => {
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
  }),
);

router.get("/login", 
  saveRedirectedUrl,
  (req, res) => {
    res.render("users/login.ejs");
  }
);

router.post(
  "/login",
  saveRedirectedUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    let { username } = req.body;
    req.flash("success", `Welcome  ${username} !!!`);
    let redirectUrl=res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
  },
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      next(err);
    }
    req.flash("success", " You are logged out");
    res.redirect("/listings");
  });
});

module.exports = router;
