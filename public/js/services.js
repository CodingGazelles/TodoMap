'use strict';

/* Services */

angular.module( 'todoApp.services', ['ngResource']).
factory('Tree', function($resource) {
    var Tree = $resource('/api/tree', {}, {
        get: {method: 'GET'}
    });
    return Tree;
});
