const geocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const Listing = require("../models/listing.js");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding")
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken});

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {

let response=await geocodingClient.forwardGeocode({
query: req.body.listing.location,
limit:1
}).send()


  const imageUrl = req.file?.path || req.file?.url;
  if (!imageUrl) {
    const ExpressError = require("../utils/ExpressError.js");
    throw new ExpressError(400, "Please upload a listing image.");
  }

  const listingData = { ...req.body.listing };
  if (!listingData.image?.trim()) {
    delete listingData.image;
  }

  const newListing = new Listing(listingData);
  newListing.owner = req.user._id;
  newListing.image = { url: imageUrl, filename: req.file.filename };
  newListing.geometry=response.body.features[0].geometry;


 let savedListing= await newListing.save();
 console.log(savedListing);
 
 req.flash("success", "New Listing Created!");
 res.redirect("/listings");
};

module.exports.showListing = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id)
    .populate({
      path: "reviews",
      populate: {
        path: "author",
      },
    })
    .populate("owner");
  if (!listing) {
    req.flash("error", " Listing Does Not Exists !");
    return res.redirect("/listings");
  }

  res.render("listings/show.ejs", {
    listing,
    mapToken: process.env.MAP_TOKEN,
  });
};

module.exports.editListing = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", " Listing Does Not Exists !");
    return res.redirect("/listings");
  }

  res.render("listings/edit.ejs", { listing });
  // console.log(listing);
};

module.exports.deleteListing = async (req, res) => {
  let { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", " Listing Deleted !");

  res.redirect("/listings");
};


module.exports.updateListing =async (req, res) => {
    let { id } = req.params;
    const updates = { ...req.body.listing };
    delete updates.image;
    if (req.file) {
      updates.image = { url: req.file.path || req.file.url, filename: req.file.filename };
    }

    await Listing.findByIdAndUpdate(id, updates, { runValidators: true });
    req.flash("success", " Listing Edited !");

    res.redirect(`/listings/${id}`);
  }

