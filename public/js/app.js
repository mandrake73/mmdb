'use strict';


/* App Module */

var phonecatApp = angular.module('phonecatApp', [
  'ngRoute',
  'phonecatAnimations',
'ui.router',
  'phonecatControllers',
  'phonecatFilters',
  'phonecatServices'
]);

phonecatApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  $urlRouterProvider.otherwise("/movies");
  //
  // Now set up the states
  $stateProvider
    .state('movies', {
      url: "/movies",
      templateUrl: "partials/movieList.html",
	  controller: 'IndexMovieListCtrl'
    })
    .state('movies.detail', {
      url: "/:movieId",
      templateUrl: "partials/movieDetail.html",
      controller: 'DetailMovieCtrl'
    })
    .state('tvshows', {
      url: "/tvshows",
      templateUrl: "partials/tvshowList.html",
	  controller: 'IndexTVShowListCtrl'
    })
    .state('tvshows.detail', {
      url: "/:tvshowId",
      templateUrl: "partials/tvshowDetail.html",
      controller: 'DetailTVShowCtrl'
    })
    }).run(function($rootScope, $state) {
		      $rootScope.$state = $state;
		    });