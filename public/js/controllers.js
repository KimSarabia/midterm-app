'use strict';

var app = angular.module('myApp');

app.controller('mainCtrl', function($scope, User, $state, $sessionStorage) {
  console.log('main controller works!');
  $scope.isLoggedIn = !!$sessionStorage.currentUser;
  $scope.$watch(function() {
    return $sessionStorage.currentUser;
  }, function(newVal, oldVal) {
    $scope.isLoggedIn = !!newVal;
  });

  $scope.logOut = () => {
    User.logout()
      .then(res => {
        console.log(res);
        $sessionStorage.currentUser = null;
        $state.go('home');
      });
  }
});

app.controller('homeCtrl', function($scope, User, $state) {
  console.log('home controller works!');
});

//TODO ADD NEW 'THING' CONTROLLER HERE --'ADD A THING'
app.controller("newBeerCtrl", function($scope, $state, User, Beer) {
  console.log('beer controller works!');
    $scope.randomBeer = function() {
      Beer.getRandom()
      .then(function(res) {
        $scope.beer = res.data;
      }, function(err) {
        console.log('err: ', err);
      })
    };
});

app.controller("allBeersCtrl", function($scope, $state, User, Beer) {
  console.log('all beers works!!');
    $scope.allBeers = function() {
      Beer.getAll()
      .then(function(res) {
        $scope.beers = res.data;
      }, function(err) {
        console.log('err: ', err);
      })
    };
});


//TODO ADD 'THING CONTROLLER HERE' --SHOW SINGLE 'THING' CONTROLLER

//TODO ADD 'THINGS CONTROLLER HERE' --SHOW LIST OF THINGS

app.controller('auctionsCtrl', function($scope, User, $state, Beer) {
  console.log('beersCtrl');
  $scope.beers = [];
  Auction.getAll()
    .then((res) => {
      $scope.beers = res.data;
    })
  $scope.newBeer = () => {
    $state.go('newbeer');
  }
});


app.controller('registrationCtrl', function($scope, User, $state, $timeout) {
  console.log('registration controller works!');
  $scope.registration = {};
  $scope.success = false;
  $scope.notMatching = false;
  $scope.register = () => {
    if($scope.registration.password1 !== $scope.registration.password2) return $scope.notMatching = true;
    var newUser = {
      email: $scope.registration.email,
      password: $scope.registration.password1,
      username: $scope.registration.username,
      firstName: $scope.registration.firstName,
      lastName: $scope.registration.lastName
    }
    $scope.success = true;
    User.signup(newUser)
      .then((res) => {
          $state.go('login')
      })
  }
});


app.controller('loginCtrl', function($scope, User, $state, $sessionStorage) {
  console.log('login controller works!');
  $scope.credentials = {};
  $scope.login = () => {
    User.login($scope.credentials)
          .then(() => {
            $state.go('profile')
          });
  };
});

app.controller('profileCtrl', function($scope, User, $state, $sessionStorage, $stateParams) {
  console.log('profile controller works!');
  $scope.profile = {};
  User.loadprofile()
    .then((res) => {
      $scope.profile = res.data;
    });
});
