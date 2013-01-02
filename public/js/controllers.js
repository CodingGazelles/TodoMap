'use strict';

/* Controllers */

todoApp.controller('MapCtrl', function($scope, maps) {
    console.log("call controller Map");
    
    $scope.mapData = {};
    maps.getMap({id: "50e4ad430abcd7f031000001"},

    function(data) { // SUCCESS
        console.log("call api maps.getMap succeed");
        weighChildNodes(data);
        scaleNodeWeight(data);
        //colorize(data);
        $scope.mapData = data;
        console.log("$scope.mapData: " + JSON.stringify( data));
    },

    function(data) { // FAILURE
        console.log("call api maps.getMap failed");
        console.log("data: " + data);
        $scope.mapData = {
            label: "error",
            childNodes: []
        };
        console.log("$scope.mapData: " + JSON.stringify($scope.tree));
    });
});

function colorize(tree, hsvColor, hueVar) {
    if (hueVar === undefined) hueVar = 360;
    if (hsvColor === undefined) hsvColor = {
        h: 0,
        s: 0.7,
        v: 1
    };
    hueVar = Math.min(hueVar, 360);
    var nColor = tree.childNodes.length;
    var color = {
        h: (360 + hsvColor.h - hueVar * 3 / 8) % 360,
        s: hsvColor.s,
        v: hsvColor.v
    };
    for (var i = 0; i < nColor; i++) {
        color = {
            h: (color.h + hueVar / nColor * i) % 360,
            s: color.s,
            v: color.v
        };
        tree.childNodes[i].bgcolor = tinycolor("hsv (" + color.h + " " + color.s + " " + color.v + ")").toHexString();
        colorize(tree.childNodes[i], {
            h: color.h,
            s: color.s * 0.65,
            v: color.v
        }, hueVar / nColor);
    }
}

function weighChildNodes(node) {
    node.childNodesWeight = 0;
    if( node.childNodes !== undefined && node.childNodes.length !== 0){
        node.childNodes.forEach( function(child){
            if( child.childNodes !== undefined && child.childNodes.length !== 0)
                weighChildNodes(child.childNodes);
                
            node.childNodesWeight += child.weight + child.childNodesWeight;
        });
    }
}

function scaleNodeWeight(node, siblingNodesWeight) {
    if (siblingNodesWeight === undefined) 
        siblingNodesWeight = node.weight + node.childrenWeight;
    
    node.weightScale = ((node.weight + node.childNodesWeight) / siblingNodesWeight * 100).toFixed(1) + "%";
    
    if( node.childNodes !== undefined && node.childNodes.length !== 0){
        node.childNodes.forEach( function( child){
            scaleNodeWeight( child, node.childNodesWeight);
        })
    }
}
