'use strict';

/* Controllers */

angular.module('App.Controllers', [])

.run([ '$rootScope', '$debounce', function( $rootScope, $debounce){
}])

.controller('AppCtrl', [ '$rootScope', '$debounce', function( $rootScope, $debounce){
}])

.controller('TodomapCtrl', [ '$storage', function( $storage){
    $storage.loadTree("510bf39e5ba1aa4c95000001");
}]);






