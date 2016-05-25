'use strict';
//TODO: ADD thing.js model
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var moment = require('moment');
var bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

//TODO: Add thing model here
// EXAMPLE: var Thing = require('../models/thing');

var userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: {type: String, required: true},
  firstName: {type: String, required: true},
  lastName: {type: String, required: true},
  isAdmin: { type: Boolean, default: false }
  //TODO: ADD THING REF HERE
  // things: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Thing' }]
});

// IT'S MIDDLEWARE!!
userSchema.statics.isLoggedIn = function(req, res, next) {
  var token = req.cookies.accessToken;

  jwt.verify(token, JWT_SECRET, (err, payload) => {
    if(err) return res.status(401).send({error: 'Must be authenticated.'});

    User
      .findById(payload._id)
      .select({password: false})
      .populate('auctions')
      .exec((err, user) => {
        if(err || !user) {
          return res.clearCookie('accessToken').status(400).send(err || {error: 'User not found.'});
        }
        req.user = user;
        next();
      })
  });
};

userSchema.statics.register = function(userObj, cb) {
  User.findOne({email: userObj.email}, (err, dbUser) => {
    if(err || dbUser) return cb(err || { error: 'Username not available.' })

    bcrypt.hash(userObj.password, 10, (err, hash) => {
      if(err) return cb(err);

      var user = new User({
        email: userObj.email,
        password: hash,
        username: userObj.username,
        firstName: userObj.firstName,
        lastName: userObj.lastName
      })
      user.save(cb)
    })
  })
};

userSchema.statics.editProfile = function(userId, newUser, cb) {
  User.findByIdAndUpdate(userId, { $set: newUser }, {new: true}, cb);
};

userSchema.statics.authenticate = function(userObj, cb) {
  this.findOne({email: userObj.email}, (err, dbUser) => {
    if(err || !dbUser) return cb(err || { error: 'Login failed. Username or password incorrect.' });

    bcrypt.compare(userObj.password, dbUser.password, (err, isGood) => {
      if(err || !isGood) return cb(err || { error: 'Login failed. Username or password incorrect.' });

      var token = dbUser.makeToken();

      cb(null, token, dbUser._id);
    })
  });
};

userSchema.methods.makeToken = function() {
  var token = jwt.sign({
    _id: this._id,
    exp: moment().add(1, 'day').unix() // in seconds
   }, JWT_SECRET);
  return token;
};

//TODO:
//ADD USERSCHEMA METHODS HERE...
// userSchema.methods.addThing = function(thingObj, cb) {
//   this.things.push(thingObj);
//   this.save(cb);
// };
//
// userSchema.methods.removeThing = function(thingId, cb) {
//   var index = this.things.indexOf(thingId.toString());
//   console.log('index:', index);
//   this.things.splice(index, 1);
//   this.save(cb);
// };

var User = mongoose.model('User', userSchema);

module.exports = User;
