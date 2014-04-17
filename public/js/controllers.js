'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', ['ui.router']);

phonecatControllers.controller('IndexMovieListCtrl', ['$scope', 'Movies',
  function($scope, Movies) {
    $scope.movies = Movies.query();
    $scope.orderProp = 'name';
  }]);

phonecatControllers.controller('DetailMovieCtrl', ['$scope', '$stateParams', 'Movie',
  function($scope, $stateParams, Movie) {
    $scope.movie = Movie.get({movieId: $stateParams.movieId}, function(movie) {
      $scope.mainImageUrl = null;//movie.images[0];
    });

    /*$scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }*/
  }]);
