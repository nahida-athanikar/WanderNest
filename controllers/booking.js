const Listing = require("../models/listing");
const Booking = require("../models/booking");

module.exports.showReservePage = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);

  // temporary default values (later can come from form)
  let booking = {
    checkIn: new Date().toISOString().split("T")[0],
    checkOut: new Date(Date.now() + 86400000).toISOString().split("T")[0],
    guests: 1,
    user: req.user ? req.user.username : "Guest User"
  };

  res.render("bookings/preview", { listing, booking });
};



module.exports.confirmBooking = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    const { checkIn, checkOut, guests } = req.body.booking;

    const booking = new Booking({
        user: req.user._id,
        listing: listing._id,
        checkIn,
        checkOut,
        guests
    });

    await booking.save();

    res.render("bookings/bookingConfirmation", { listing, booking });
};
