'use strict';

/* Controllers */



todoApp.controller('MapCtrl', function($scope, debounce, maps) {
    
    // binding window resize event with $scope.$digest to trigger registered $scope.$watch in map directive
    angular.element(window).bind('resize', function() {
        console.log("Callback event window resize");
        debounce( $scope.$digest(), 2000, false);
    });
    
    // listener on saveMap event
    $scope.$on( 'saveMap', function onSaveMap(){
        console.log("callback listener onSaveMap");
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
                var tree = TdNode.parse( data);
                colorizeNodes([tree]);
                $scope.mapData = tree;
                //console.log("$scope.mapData: " + JSON.stringify(data));
            },
            function(data) { // FAILURE
                console.log("call api maps.getMap failed");
                console.log("data: " + data);
                $scope.mapData = {
                    label: "error",
                    childNodes: []
                };
                console.log("$scope.mapData: " + JSON.stringify(data));
            }
        );
    };
    
    $scope.saveMap = function(){
        console.log("call function saveMap");
        //console.log("$scope.mapData: " + JSON.stringify( $scope.mapData));
        
        // TODO: nettoyer map
        
        maps.saveMap(
            {id: $scope.mapData._id},
            $scope.mapData,
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
    $scope.mapData = {};
    $scope.loadMap("5100316ce05f9ac773000001");
});


function colorizeNodes(nodes, parentColor, hueRange) {
    if (nodes === undefined || nodes.length === 0) return;

    if (parentColor === undefined) parentColor = {
        h: 0,
        s: 0.9,
        v: 1
    };

    if (hueRange === undefined) hueRange = 360;
    else hueRange = Math.min(hueRange, 360);

    var hueOffset = hueRange / nodes.length;
    var color = {};
    for (var i in nodes) {
        color.h = (parentColor.h + hueOffset * i) % 360;
        color.s = parentColor.s;
        color.v = parentColor.v;

        if (nodes[i].style === undefined) nodes[i].style = {};

        nodes[i].style.bgcolor = tinycolor("hsv (" + color.h + " " + color.s + " " + color.v + ")").toHexString();
        if (nodes[i].childNodes !== undefined) colorizeNodes(nodes[i].childNodes, {
            h: color.h,
            s: color.s * 0.65,
            v: color.v
        }, hueRange / nodes.length);
    }
}




