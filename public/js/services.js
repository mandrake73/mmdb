'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Movies', ['$resource',
  function($resource){
    return $resource('/api/movies', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);


phonecatServices.factory('Movie', ['$resource',
  function($resource){
    return $resource('/api/movies/:movieId', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);


phonecatServices.factory('TVShows', ['$resource',
  function($resource){
    return $resource('/api/tvshows', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);


phonecatServices.factory('TVShow', ['$resource',
  function($resource){
    return $resource('/api/tvshows/:tvshowId', {}, {
      query: {method:'GET', params:{}, isArray:true}
    });
  }]);