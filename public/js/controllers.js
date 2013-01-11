'use strict';

/* Controllers */



todoApp.controller('MapCtrl', function($scope, debounce, maps) {
    console.log("call controller Map");

    $scope.mapData = {};
    maps.getMap({
        id: "50f00179d9282cc575000001"
    },

    function(data) { // SUCCESS
        console.log("call api maps.getMap succeed");
        //weighChildNodes(data);
        //scaleBranchWeight(data);
        colorizeNodes([data]);
        $scope.mapData = data;
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
    });


    // version 1
    //    angular.element(window).bind('resize', function(){
    //        $scope.$digest();
    //    });

    // version 2
    //    var element = document.getElementById("td-map");
    //    $scope.mapSize = {width: element.offsetWidth, height: element.offsetHeight};
    //    
    //    angular.element(window).bind('resize', function(){
    //        if( $scope.mapSize.width !== element.offsetWidth || $scope.mapSize.height !== element.offsetHeight)
    //            $scope.mapSize = {width: element.offsetWidth, height: element.offsetHeight};
    //    });

    // version 3
//    angular.element(window).bind('resize', function() {
//
//        $.doTimeout('resize', 250, function() {
//            $scope.$digest();
//        });
//
//    });
    
    // version 4
    angular.element(window).bind('resize', function() {
        console.log("Callback map resize");
        debounce( $scope.$digest(), 2000, false);
    });
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

function weighChildNodes(node) {
    node.childNodesWeight = 0;
    if (node.childNodes !== undefined && node.childNodes.length !== 0) {
        node.childNodes.forEach(function(child) {
            weighChildNodes(child);

            node.childNodesWeight += child.weight + child.childNodesWeight;
        });
    }
}

function scaleBranchWeight(node, siblingNodesWeight) {
    if (siblingNodesWeight === undefined) siblingNodesWeight = node.weight + node.childNodesWeight;

    node.weightScale = ((node.weight + node.childNodesWeight) / siblingNodesWeight).toFixed(3);

    if (node.childNodes !== undefined && node.childNodes.length !== 0) {
        node.childNodes.forEach(function(child) {
            scaleBranchWeight(child, node.childNodesWeight);
        });
    }
}
