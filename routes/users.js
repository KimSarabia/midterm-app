'use strict';

var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Beer = require('../models/beer');

//TODO: var Thing = require('../models/thing');

router.get('/', (req, res) => {
  console.log('res:', res);
  User.find({}, (err, users) => {
    res.status(err ? 400 : 200).send(err || users);
    console.log(res);
  }).select({password: false});
});

router.post('/register', (req, res) => {
  User.register(req.body, err => {
    console.log('req.body:', req.body);
    console.log(err);
    res.status(err ? 400 : 200).send(err || "USER REGISTERED!");
    console.log(err);
  });
});

router.post('/login', (req, res) => {
  User.authenticate(req.body, (err, token, currentUserId) => {
    if(err) return res.status(400).send(err);

    res.cookie('accessToken', token).send(currentUserId);
  });
});

router.delete('/logout', (req, res) => {
  res.clearCookie('accessToken').send('You\'ve successfully logged out!');
});

router.get('/profile', User.isLoggedIn, (req, res) => {
  User.findById(req.user._id, (err, user) => {
    if(err) return res.status(400).send(err);
    res.send(req.user);
  });
})

router.put('/profile', User.isLoggedIn, (req, res) => {
  User.editProfile(req.user._id, req.body, (err, edtUser) => {
    if(err) return res.status(400).send(err);
    res.send(edtUser);
  })
})

router.get('/people', User.isLoggedIn, (req, res) => {
  User
    .find({_id: {$ne: req.user._id}}) // excludes the logged in user
    .select({password: false})
    .exec((err, users) => {
      return err ? res.status(400).send(err) : res.send(users);
    });
})

router.get('/people/:id', User.isLoggedIn, (req, res) => {
  User.findById(req.params.id)
    .select({password: false})
    .exec((err, user) => {
    return err ? res.status(400).send(err) : res.send(user);
  })
})

module.exports = router;
