const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/user");

module.exports = function(passport) {
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:
    process.env.NODE_ENV === "production"
      ? "https://wandernest-w9b9.onrender.com/auth/google/callback"
      : "/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      const username = profile.displayName;

      // ✅ STEP 1: check by email
      let user = await User.findOne({ email });

      if (user) {
        user.googleId = profile.id;

        if (!user.avatar) {
          user.avatar = profile.photos[0].value;
        }

        await user.save();
        return done(null, user);
      }

      // ✅ STEP 2: check by username (IMPORTANT FIX)
      let existingUsername = await User.findOne({ username });

      let finalUsername = username;

      // ✅ If username already exists → make unique
      if (existingUsername) {
        finalUsername = username + "_" + Date.now();
      }

      // ✅ STEP 3: create new user safely
      const newUser = new User({
        username: finalUsername,
        email: email,
        googleId: profile.id,
        avatar: profile.photos[0].value
      });

      await newUser.save();
      done(null, newUser);

    } catch (err) {
      done(err, null);
    }
  }));
};