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

/*phonecatApp.config(['$routeProvider',
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
*/

phonecatApp.config(function($stateProvider, $urlRouterProvider) {
  //
  // For any unmatched url, redirect to /state1
  //$urlRouterProvider.otherwise("/movies");
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
      templateUrl: "partials/state2.html"
    })
    .state('tvshows.detail', {
      url: "/tvshows/",
        templateUrl: "partials/state2.list.html",
        controller: function($scope) {
          $scope.things = ["A", "Set", "Of", "Things"];
        }
      })
    }).run(function($rootScope, $state) {
		      $rootScope.$state = $state;
		    });