const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  googleId: String,
  credits: { type: Number, default: 0 }
});

// Name of Model Class & name of Schema
mongoose.model('users', userSchema);

// Need to require file in index.js
