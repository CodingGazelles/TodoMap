'use strict';

/* Controllers */

todoApp.controller('Tree', function($scope, Tree) {
    console.log("call function Tree");
    Tree.get({},

    function(data) { // SUCCESS
        console.log("call api Tree.get succeed");
        calChildrenWeight(data);
        calRelativeWeight(data);
        colorize(data);
        $scope.tree = data;
        // console.log("$scope.tree: " + JSON.stringify( $scope.tree));
    },

    function(data) { // FAILURE
        console.log("call api Tree.get failed");
        console.log("data: " + data);
        $scope.tree = {
            label: "error",
            childNodes: []
        };
        console.log("$scope.tree: " + JSON.stringify($scope.tree));
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

function calChildrenWeight(tree) {
    if (tree.weight === undefined) tree.weight = 0;
    if (tree.childrenWeight === undefined) tree.childrenWeight = 0;
    for (var i = 0; i < tree.childNodes.length; i++) {
        calChildrenWeight(tree.childNodes[i]);
        tree.childrenWeight += tree.childNodes[i].weight + tree.childNodes[i].childrenWeight;
    }
}

function calRelativeWeight(tree, totLevelWeight) {
    if (totLevelWeight === undefined) {
        totLevelWeight = tree.weight + tree.childrenWeight;
    }
    tree.relatWeight = ((tree.weight + tree.childrenWeight) / totLevelWeight * 100).toFixed(1) + "%";
    for (var i = 0; i < tree.childNodes.length; i++) {
        calRelativeWeight(tree.childNodes[i], tree.childrenWeight);
    }
}
