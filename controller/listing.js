const Listing = require("../models/listing.js");

module.exports.index = async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
};

module.exports.newListing = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.createListing = async (req, res) => {
  const listingData = { ...req.body.listing };
  if (!listingData.image?.trim()) {
    delete listingData.image;
  }

  const newListing = new Listing(listingData);
  newListing.owner = req.user._id;
  await newListing.save();
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

  res.render("listings/show.ejs", { listing });
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

    const listing = await Listing.findByIdAndUpdate(id, {
      ...req.body.listing,
    });
    req.flash("success", " Listing Edited !");

    res.redirect(`/listings/${id}`);
  }

