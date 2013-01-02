'use strict';

/* Services */

angular.module( 'dataServices', ['ngResource'])
.factory('maps', function($resource) {
    return $resource('/api/maps/:id', {id:'@id'}, {
        getMap: {method: 'GET'},
        saveMap: {method: 'PUT'}
    });
});

