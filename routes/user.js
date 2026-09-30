const express = require("express");
const router = express.Router({ mergeParams: true });
const passport = require("passport");
const wrapAsync = require("../utils/wrapAync.js");
const userController = require("../controller/users.js");
const { saveRedirectedUrl } = require("../middleware.js");

router
  .route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));

router
  .route("/login")
  .get(saveRedirectedUrl, userController.renderLoginForm)
  .post(
    saveRedirectedUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.login,
  );



router.get("/logout", userController.logout);

module.exports = router;
