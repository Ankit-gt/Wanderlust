const cloudinary = require("cloudinary");
const CloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// multer-storage-cloudinary@2 expects the root cloudinary module (it calls .v2 internally)
const storage = CloudinaryStorage({
  cloudinary,
  folder: "wanderlust_Dev",
  allowedFormats: ["png", "jpeg", "jpg"],
});

module.exports = {
  cloudinary: cloudinary.v2,
  storage,
};
