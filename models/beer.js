"use strict";

var mongoose = require('mongoose');

const JWT_SECRET = process.env.JWT_SECRET;
var User = require('../models/user');

var beerSchema = new mongoose.Schema({
  name: { type: String },
  imgUrl: { type: String },
  description: { type: String },
  sampled: { type: Boolean, default: false },
  rating: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  notes: { type: String }
});

var Beer = mongoose.model("Beer", beerSchema);

module.exports = Beer;
