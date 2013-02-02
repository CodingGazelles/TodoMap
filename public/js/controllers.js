'use strict';

/* Controllers */



todoApp.controller('MapCtrl', function($scope, debounce, maps){
    
    // binding window resize event with $scope.$digest to trigger registered $scope.$watch in map directive
    angular.element(window).bind('resize', function onWindowResize() {
        console.log("Callback event window resize");
        debounce( $scope.$digest(), 2000, false);
    });
    
    // listener on saveMap event
    $scope.$on( 'saveMap', function( event){
        console.log("Catch event save map");
        event.stopPropagation();
        $scope.savedState = "Saving ...";
        $scope.$digest();
        debounce( $scope.saveMap(), 20000, false);
    });
    
    $scope.loadMap = function( mapId){
        console.log("call function loadMap");
        maps.getMap(
            {id: mapId},
            function(data) { // SUCCESS
                console.log("call api maps.getMap succeed");
                // console.log("$scope.todoTree: " + JSON.stringify(data));
                
                var tree = TdTree.buildTree( data);
                $scope.todoTree = tree;
            },
            function(data) { // FAILURE
                console.log("call api maps.getMap failed");
                console.log("data: " + data);
                $scope.mapData = {
                    label: "error",
                    childNodes: []
                };
//                console.log("$scope.mapData: " + JSON.stringify(data));
            }
        );
    };
    
    $scope.saveMap = function(){
        console.log("call function saveMap");
        
        var todoData = TdTree.filterTree( $scope.todoTree);
        // console.log("$scope.mapData: " + JSON.stringify( todoData));
        
        maps.saveMap(
            {id: todoData._id},
            todoData,
            function(data) { // SUCCESS
                console.log("call api maps.saveMap succeed");
                //console.log("$scope.mapData: " + JSON.stringify(data));
            },
            function(data) { // FAILURE
                console.log("call api maps.saveMap failed");
                //console.log("$scope.mapData: " + JSON.stringify(data));
            }
        );
        $scope.savedState = "Saved";
    };
    
    console.log("Loading Map");
    $scope.todoTree = {};
    $scope.loadMap("510bf39e5ba1aa4c95000001");
    
});







