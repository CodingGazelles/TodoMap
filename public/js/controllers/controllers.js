'use strict';

/* Controllers */

angular.module('App.Controllers', [])

.run([ '$rootScope', '$debounce', function( $rootScope, $debounce){

    // binding window resize event with $scope.$digest to trigger registered $scope.$watch in map directive
    angular.element(window).bind('resize', function() {
        console.log("Catch event window resize");
        $rootScope.resizeMap();
    });

    // trigger registered $scope.$watch in map directive
    // todo: refactor, don't use digest incontrollers
    $rootScope.resizeMap = function(){
        console.log("Resizing map");
        $debounce( $rootScope.$digest(), 2000, false);
    };

}])

.controller('AppCtrl', function($scope, $treeManager){
    $scope.todoTree = {};
    $treeManager.loadTree("510bf39e5ba1aa4c95000001");
});






