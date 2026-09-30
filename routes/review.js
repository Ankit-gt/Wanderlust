const express = require("express");
const router = express.Router({ mergeParams: true });

const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAync.js");
const {validateReview, isLoggedIn, isReviewAuthor}=require("../middleware.js")
const controllerReview= require("../controller/review.js")


//reviews
router.post(
  "/",
  isLoggedIn,
  validateReview,
  wrapAsync(controllerReview.createReview),
);

//delete review
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(controllerReview.deleteReview),
);

module.exports = router;
