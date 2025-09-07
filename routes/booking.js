const express = require("express");
const router = express.Router({ mergeParams: true });
const { isLoggedIn } = require("../middleware");
const bookingController = require("../controllers/booking");
const wrapAsync = require("../utils/wrapAsync");

// Show booking preview
router.post("/reserve", isLoggedIn, bookingController.showReservePage);

// Confirm booking
router.post("/confirm", isLoggedIn, bookingController.confirmBooking);

module.exports = router;