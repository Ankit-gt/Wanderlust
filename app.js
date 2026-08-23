const express = require("express");
const app = express();
const port = 3000;
const Listing = require("./models/listing");
const path = require("path");
const methodOverride=require("method-override");
const mongoose = require("mongoose");
const ejsMate=require("ejs-mate")


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.engine("ejs" ,ejsMate)
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname,"/public")))


app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"))

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// Index route
app.get("/listings", async (req, res) => {
  let allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// New route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});


//create route
app.post("/listings", async (req, res) => {
  const newListing = new Listing(req.body.listing);
  await newListing.save();
  res.redirect("/listings");
  console.log(newListing);
});

// Show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});

//edit route
app.get("/listings/:id/edit", async (req,res)=>{
  let {id}=req.params;
  const listing= await Listing.findById(id)
  res.render("listings/edit.ejs",{listing})
  // console.log(listing);
  
})
//delete route
app.delete("/listings/:id", async (req,res)=>{
  let {id}=req.params;
 await Listing.findByIdAndDelete(id)
  res.redirect("/listings",)
})

//update route
app.put("/listings/:id", async (req,res)=>{
  let {id}=req.params;
  const listing= await Listing.findByIdAndUpdate(id,{...req.body.listing})
  res.redirect(`/listings/${id}`);
})

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
