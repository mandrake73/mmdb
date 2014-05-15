'use strict';

/* Controllers */

var phonecatControllers = angular.module('phonecatControllers', ['ui.router']);

phonecatControllers.controller('IndexMovieListCtrl', ['$scope', 'Movies',

  function($scope, Movies) {

    $scope.sort = function(item) {
   /*if (  $scope.orderProp == 'date') {
        return new Date(item.date);
    }*/
    return item[$scope.orderProp];
  }

   //$scope.orderProp='date';

    $scope.tab = function (tabIndex) {

     //Sort by date
      if (tabIndex == 0){
        //alert(tabIndex);
        $scope.orderProp='name';
      }   
      //Sort by views 
      if (tabIndex == 1){
        $scope.orderProp = 'date';
      }

   };

    $scope.orderProp = 'name';
    $scope.movies = Movies.query();
    
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


    $scope.sort = function(item) {
   /*if (  $scope.orderProp == 'date') {
        return new Date(item.date);
    }*/
    return item[$scope.orderProp];
  }

    $scope.tab = function (tabIndex) {

     //Sort by date
      if (tabIndex == 0){
        //alert(tabIndex);
        $scope.orderProp='name';
      }   
      //Sort by views 
      if (tabIndex == 1){
        $scope.orderProp = 'date';
      }

   };


    $scope.orderProp = 'name';
    $scope.tvshows = TVShows.query();
    
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
