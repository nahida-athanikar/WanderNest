const express = require("express");
const router = express.Router();
const passport = require("passport");

// Google login
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// callback
router.get("/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login"
  }),
  (req, res) => {
    res.redirect("/listings");
  }
);

module.exports = router;