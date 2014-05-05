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


phonecatControllers.controller('IndexTVShowListCtrl', ['$scope', 'TVShows',
  function($scope, TVShows) {
    $scope.tvshows = TVShows.query();
    $scope.orderProp = 'name';
  }]);

phonecatControllers.controller('DetailTVShowCtrl', ['$scope', '$stateParams', 'TVShow',
  function($scope, $stateParams, TVShow) {
    $scope.tvshow = TVShow.get({tvshowId: $stateParams.tvshowId}, function(tvshow) {
      $scope.mainImageUrl = null;//movie.images[0];
    });

    /*$scope.setImage = function(imageUrl) {
      $scope.mainImageUrl = imageUrl;
    }*/
  }]);
