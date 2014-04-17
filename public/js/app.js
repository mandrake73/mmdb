'use strict';


/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatAnimations',

  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices'
]);

phonecatApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/movies', {
        templateUrl: 'partials/movieList.html',
        controller: 'IndexMovieListCtrl'
      }).
      when('/movies/:movieId', {
        templateUrl: 'partials/movieDetail.html',
        controller: 'DetailMovieCtrl'
      }).
      otherwise({
        redirectTo: 'movies'
      });
  }]);
