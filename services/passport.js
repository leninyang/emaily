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
      callbackURL: '/auth/google/callback'
    },
    (accessToken, refreshToken, profile, done) => {
      // Mongoose query
      User.findOne({ googleId: profile.id }).then(existingUser => {
        if (existingUser) {
          // We already have a record with the given profile ID
          done(null, existingUser);
        } else {
          // We dont have auser record with this ID, make a new record
          new User({ googleId: profile.id }) // Create & Save new user to database
            .save()
            .then(user => done(null, user));
        }
      });
    }
  )
);
