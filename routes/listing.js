const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer');
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
const { smartSearch } = require("../utils/searchHelper.js");

// All Listings + Search
router.get("/", async (req, res) => {
    try {
        const { q } = req.query;

        // Fetch all listings from DB
        const listings = await Listing.find({});

        let filteredListings = listings;

        if (q) {
            // Use smart search helper instead of regex
            filteredListings = smartSearch(listings, q);
        }

        res.render("listings/index", { 
            allListings: filteredListings, 
            searchQuery: q || "" 
        });

    } catch (err) {
        console.error(err);
        res.redirect("/listings");
    }
});


// Index route ,  Create route 
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn,  
    upload.single("listing[image]"), 
    validateListing, 
    wrapAsync(listingController.createListing)
  );
  
  

// New Route 
router.get("/new", isLoggedIn, listingController.renderNewForm); 

// Start dashboard
router.get("/startDashboard", (req, res) => {
  res.render("listings/startDashboard");
  });

//Show route , Update route ,  Delete
router.route("/:id")
  .get(wrapAsync( listingController.showListing))
  .put(isLoggedIn, 
      isOwner, 
      upload.single("listing[image]"), 
      validateListing, 
      wrapAsync(listingController.updateListing))
  .delete(isLoggedIn, 
          isOwner, 
          wrapAsync(listingController.deleteListing));


// Edit Route
router.get("/:id/edit", 
  isLoggedIn, 
  isOwner, wrapAsync(listingController.renderEditForm));


module.exports = router;
