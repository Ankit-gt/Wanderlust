const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAync.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const ListingController = require("../controller/listing.js");
const multer=require("multer");
const upload = multer({ dest: 'uploads/' })

//view route
//create route
router
  .route("/")
  .get(wrapAsync(ListingController.index))
  .post(
    isLoggedIn,
    validateListing,
    wrapAsync(ListingController.createListing)
  );

// New route
router.get("/new", isLoggedIn, ListingController.newListing);

//edit route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(ListingController.editListing));


//delete route
// Show route
//update route
router.route("/:id")
.get(wrapAsync(ListingController.showListing))
.delete(isLoggedIn, isOwner, wrapAsync(ListingController.deleteListing))
.put(
   validateListing,
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.updateListing),
);
module.exports = router;