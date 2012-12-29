'use strict';

/* Services */

angular.module( 'todoApp.treeServices', ['ngResource'])
.factory('Tree', function($resource) {
    var tree = $resource('/api/tree', {}, {
        get: {method: 'GET'}
    });
    return tree;
});
