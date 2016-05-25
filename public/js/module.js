'use strict';

var app = angular.module('myApp', ['ui.router', 'ui.bootstrap', 'ngStorage']);

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
      url:'/',
      templateUrl: '/html/home.html',
      controller: 'homeCtrl'
    })
    .state('login', {
      url:'/login',
      templateUrl: '/html/login.html',
      controller: 'loginCtrl'
    })
    .state('registration', {
      url:'/registration',
      templateUrl: '/html/registration.html',
      controller: 'registrationCtrl'
    })
    .state('profile', {
      url:'/profile',
      templateUrl: '/html/profile.html',
      controller: 'profileCtrl'
    })
    .state('newbeer', {
      url:'/newbeer',
      templateUrl: '/html/newbeer.html',
      controller: 'newBeerCtrl'
    })
    .state('allbeers', {
      url:'/allbeers',
      templateUrl: '/html/allbeers.html',
      controller: 'allBeersCtrl'
    })
    //TODO: ADD NEW THING, THINGS, and THING DETAILS STATES
  $urlRouterProvider.otherwise('/');
});
