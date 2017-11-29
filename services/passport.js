const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys');
const mongoose = require('mongoose');

const User = mongoose.model('users');

// Function that takes a User model and generates unique identifier for user.
passport.serializeUser((user, done) => {
  done(null, user.id); // ID from mongoDB vs. google ID
});

// Function that takes an ID/cookie and turns it into a mongoose model instance
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

// Configuration for Googlestrategy
passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      // Mongoose query
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // We already have a record with the given profile ID
        return done(null, existingUser);
      }
      // We dont have a user record with this ID, make a new record
      const user = await new User({ googleId: profile.id }).save(); // Create & Save new user to database
      done(null, user);
    }
  )
);
