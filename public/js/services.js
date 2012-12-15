'use strict';

/* Services */


angular.module('treeServices', ['ngResource']).
  factory('Tree', function ($resource) {
    return $resource('/api/tree', {}, {
    	get: {method: 'GET'}
    });
});
