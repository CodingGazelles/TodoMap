'use strict';

/* Controllers */

angular.module('App.Controllers', [])

.run([ '$rootScope', '$debounce', function( $rootScope, $debounce){
}])

.controller('AppCtrl', [ '$rootScope', '$debounce', function( $rootScope, $debounce){
}])

.controller('TodomapCtrl', [ '$treeManager', function( $treeManager){
    $treeManager.loadTree("51200e6f22efc59ed1000001");
}]);






