const express = require("express");
const app = express();
const port = 3000;
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const session=require("express-session")
const flash=require("connect-flash")

const ExpressError = require("./utils/ExpressError.js");

const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust"

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

app.use(session({secret:"secretcode"}));
app.use(flash())

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

app.all("/{*splat}", (req, res, next) => {
  next(new ExpressError(404, "No such page exist"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wroong" } = err;
  res
    .status(statusCode)
    .render("listings/error.ejs", { message, stack: err.stack });
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
