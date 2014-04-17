'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', []);

phonecatControllers.controller('IndexMovieListCtrl', ['$scope', 'Movies',
  function($scope, Movies) {
    $scope.movies = Movies.query();
    $scope.orderProp = 'name';
  }]);

phonecatControllers.controller('DetailMovieCtrl', ['$scope', '$routeParams', 'Movies',
  function($scope, $routeParams, Movies) {
    $scope.movie = Movies.get({movieId: $routeParams.movieId}, function(movie) {
      $scope.mainImageUrl = null;//movie.images[0];
    });

    /*$scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }*/
  }]);
