const express = require("express");
const app = express();
const port = 3000;
const Listing = require("./models/listing");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAync.js");
const ExpressError = require("./utils/ExpressError.js");

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

// Index route
app.get("/listings", wrapAsync(async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
}));

// New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//create route
app.post(
  "/listings",
  wrapAsync(async (req, res) => {
    const listingData = { ...req.body.listing };
    if (!listingData.image?.url?.trim()) {
      delete listingData.image;
    }
    const newListing = new Listing(listingData);
    await newListing.save();
    res.redirect("/listings");
    console.log(newListing);
  }),
);

// Show route
app.get("/listings/:id", wrapAsync(async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
}));

//edit route
app.get("/listings/:id/edit",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
  // console.log(listing);
}));
//delete route
app.delete("/listings/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

//update route
app.put("/listings/:id",wrapAsync( async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
  res.redirect(`/listings/${id}`);
}));

app.all("/{*splat}", (req, res, next) => {
    next(new ExpressError(404, "No such page exist"));
});

app.use((err, req, res, next) => {
  let { statusCode=500, message="something went wroong" } = err;
  // res.status(statusCode).send(message);
 res.status(statusCode).render("listings/error.ejs",{message})
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
