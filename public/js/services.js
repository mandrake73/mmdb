'use strict';

/* Services */

var phonecatServices = angular.module('phonecatServices', ['ngResource']);

phonecatServices.factory('Movies', ['$resource',
  function($resource){
    return $resource('/api/movies/:movieId', {}, {
      query: {method:'GET', params:{}, isArray:false}
    });
  }]);
