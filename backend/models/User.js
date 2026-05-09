const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:         { type: String, required: true },
  email:        { type: String, required: true, unique: true },
  googleId:     { type: String, required: true, unique: true },
  picture:      { type: String },
  accessToken:  { type: String },
  refreshToken: { type: String },
  tokenExpiry:  { type: Date },
  createdAt:    { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);