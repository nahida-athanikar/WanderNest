const { required } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
   avatar: {
    type: String,
    default: "/images/default-avatar.png" // fallback profile pic
  },
  favorites: [
    {
      type: Schema.Types.ObjectId,
      ref: "Listing" // yeh tumhare Listing model ka reference hoga
    }
  ]
})

// Automatic create username, email, password
userSchema.plugin(passportLocalMongoose);
module.exports = mongoose.model('User', userSchema);
