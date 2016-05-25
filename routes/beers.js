'use strict';

var express = require('express');
var router = express.Router();

var request = require('request');
var bodyParser = require('body-parser');

var Beer = require('../models/beer');
var User = require('../models/user');

var BEER_API = '6eab8a82af8bea61371c2221f516e501'

//GET ALL



//GET RANDOM BEER
router.get('/random', User.isLoggedIn, function(req, res) {
  request(`http://api.brewerydb.com/v2/beer/random/?key=${BEER_API}`, function(err, response, body) {
    if (err) res.status(response.statusCode).send({'err': err});
    var randBeer = JSON.parse(body);
    console.log(randBeer);
    if(!randBeer.data.description) {randBeer.data.description = "DESCRIPTION UNAVAILABLE";}

    var newBeer = {
        name: randBeer.data.name,
        description: randBeer.data.description,
        user: req.user._id
      };

    Beer.create(newBeer, function(err, dbBeer) {
      User.findById(req.user._id, function(err, user) {
        if (err) res.status(400).send(err);
        user.beers.push(dbBeer);
        user.save(function(err, savedUser) {
          if (err) res.status({'Error saving user': err});
          res.send(dbBeer);
        });
      });
    });
  });
});


router.get('/', (req, res) => {
  Beer.find({}, (err, beers) => {
    return err ? res.status(400).send(err) : res.send(beers);
  });
});
module.exports = router;
