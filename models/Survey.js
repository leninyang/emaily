const mongoose = require('mongoose');
const { Schema } = mongoose;
const RecipientSchema = require('./Recipient');

const surveySchema = new Schema({
  title: String,
  body: String,
  subject: String,
  recipients: [RecipientSchema], // Sub Document Collection
  yes: { type: Number, default: 0 },
  no: { type: Number, default: 0 },
  _user: { type: Schema.Types.ObjectId, ref: 'User' }, // Relationship with User
  dateSent: Date,
  lastResponded: Date
});

// Name of Model Class & name of Schema
mongoose.model('surveys', surveySchema);

// Need to require file in index.js
