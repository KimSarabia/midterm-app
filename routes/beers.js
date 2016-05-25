'use strict';

var express = require('express');
var router = express.Router();

var request = require('request');
var bodyParser = require('body-parser');

var Beer = require('../models/beer');
var User = require('../models/user');

var BEER_API = '6eab8a82af8bea61371c2221f516e501'

//GET RANDOM BEER
router.get('/random', User.isLoggedIn, function(req, res) {
  request(`http://api.brewerydb.com/v2/beer/random/?key=${BEER_API}`, function(err, res, body) {
    if (err) res.status(res.statusCode).send({'Error retrieving beer': err});
    var randBeer = JSON.parse(body);
    if(!randBeer.data.desc) {randBeer.data.desc = "No description";}

    var newBeer = {
        name: randBeer.data.name,
        desc: randBeer.data.desc,
        user: req.user._id
      };

    Beer.create(newBeer, function(err, dbBeer) {
      User.findById(req.user._id, function(err, user) {
        if (err) res.status(400).send(err);
        user.beers.push(dbBeer);
        user.save(function(err, savedUser) {
          if (err) res.status({'err': err});
          res.send(dbBeer);
        });
      });
    });
  });
});

module.exports = router;
