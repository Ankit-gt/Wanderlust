const express = require("express");
const app = express();
const port = 3000;
const Listing = require("./models/listing");
const Review = require("./models/review.js");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAync.js");
const ExpressError = require("./utils/ExpressError.js");
const Joi = require("joi");
const { listingSchema } = require("./schema.js");
const { reviewSchema } = require("./schema.js");
const review = require("./models/review.js");

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);

  if (error) {
    throw new ExpressError(400, error);
  } else {
    next();
  }
};

// Index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    let allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
  }),
);

// New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//create route
app.post(
  "/listings",
  validateListing,
  wrapAsync(async (req, res) => {
    const listingData = { ...req.body.listing };
    if (!listingData.image?.trim()) {
      delete listingData.image;
    }

    const newListing = new Listing(listingData);
    await newListing.save();
    res.redirect("/listings");
  }),
);

// Show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  }),
);

//edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
    // console.log(listing);
  }),
);
//delete route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

//update route
app.put(
  "/listings/:id",
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    res.redirect(`/listings/${id}`);
  }),
);

//reviews
app.post(
  "/listings/:id/reviews",
  validateReview,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    console.log("revirew saved");
    res.redirect(`/listings/${id}`);
  }),
);

//delete review
app.delete(
  "/listings/:id/reviews/:reviewId",
  wrapAsync(async (req, res) => {
    let { id, reviewId } = req.params;

    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
     res.redirect(`/listings/${id}`);
  }),
);

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "No such page exist"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wroong" } = err;
  // res.status(statusCode).send(message);
  res
    .status(statusCode)
    .render("listings/error.ejs", { message, stack: err.stack });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
