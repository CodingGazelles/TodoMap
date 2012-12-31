'use strict';

/* Services */

//angular.module( 'todoApp.treeServices', ['ngResource'])
//.factory('Tree', function($resource) {
//    var tree = $resource('/api/tree', {}, {
//        get: {method: 'GET'}
//    });
//    return tree;
//});

angular.module( 'dataServices', ['ngResource'])
.factory('maps', function($resource) {
    return $resource('/api/maps/:id', {id:'@id'}, {
        getMap: {method: 'GET'},
        saveMap: {method: 'PUT'}
    });
});

