const mongoose = require("mongoose");
const review = require("./review");
const Schema = mongoose.Schema; //short liya hai bar bar mongoose.Schema na likhna pde issiliye
const Review = require("./review.js");
const { required } = require("joi");
const Booking = require("../models/booking.js");


// create schema
const listingSchema = new Schema({
title: {
  type: String,
  required : true
},

  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  bookings: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking"
    }
  ],
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },

  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      requires: true,
    },
  },

});

listingSchema.post("findOneAndDelete", async(listing) => {
  if(listing) {
    await Review.deleteMany({reviews : {$in: listing.reviews }});
  }  
});

//create Model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;