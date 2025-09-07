const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl, isLoggedIn } = require("../middleware.js");
const userController = require("../controllers/users.js");
const { route } = require("./listing.js");
const Listing = require("../models/listing");

// Signup page
router.route("/signup")
  .get(userController.renderSignupForm)
  .post(wrapAsync(userController.signup));



// Login page
router.route("/login")
  .get(userController.renderLoginForm)
  .post(saveRedirectUrl, 
    passport.authenticate("local", 
    { failureRedirect: "/login", failureFlash: true}), 
    userController.login,
);


// Logout 
router.get("/logout", userController.logout);

router.get("/account", isLoggedIn, userController.renderAccount);


// favorites page (show all saved listings)

router.get("/users/favorites", isLoggedIn, async (req, res) => {
  const user = await User.findById(req.user._id).populate("favorites");
  res.render("users/favorites", { favorites: user.favorites });
});

// toggle favorite (add/remove)
router.post("/users/favorites/:id", isLoggedIn, async (req, res) => {
  const listingId = req.params.id;
   console.log("Toggling favorite for:", listingId);
  const user = await User.findById(req.user._id);
   console.log("User before:", user.favorites); 

  const index = user.favorites.findIndex(f => f.toString() === listingId);
  let favorited = false;

  if (index === -1) {
    user.favorites.push(listingId);
    favorited = true;
  } else {
    user.favorites.splice(index, 1);
  }

  await user.save();

  // Agar AJAX (fetch) request aayi ho to JSON bhejo
  if (req.xhr || req.headers.accept.indexOf("json") > -1) {
    return res.json({ success: true, favorited });
  }

  // Nahi to normal redirect
  res.redirect("back");
});

//res.json({ success: true, action });




module.exports = router;