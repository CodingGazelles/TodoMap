'use strict';

/* Directives */

todoApp.directive('map', function($compile) {
    return {
        restrict: 'E',
        terminal: true,
        scope: {
            node: '=tdNode'
        },
        template: '<div class="top-node"></div>',
        replace : true,
        link: function linkMap(scope, iElement, iAttrs) {
            console.log("call function link of directive map");
            
            function updateMap() {
                console.log("call function updateMap");
                
                if (angular.isArray(scope.node.childNodes)) {
                    iElement.append( '<node ng-repeat="child in node.childNodes" td-node="child"></node>');
                }
                $compile(iElement.contents())(scope.$new());
            }
            
            scope.$watch( 'node', function watchMap(newValue, oldValue) {
                console.log("call watch callback");
                if ( newValue !== oldValue) updateMap();
            }, true);
        }
    };
});

todoApp.directive('node', function nodeFactory($compile) {
    return {
        restrict: 'E',
        terminal: true,
        scope: {
            node: '=tdNode'
        },
        template: '<div class="node"></div>',
        replace: true,
        link: function(scope, iElement, attrs) {
            console.log("call function link of directive node");
            
            //iElement.css( 'background-color', scope.node.bgcolor);
            
            
            
            if (angular.isArray(scope.node.childNodes)) {
                
                iElement.append( angular.element('<div class="node">{{node.label}}</div>'));
                iElement.append(
                    '<div class="childNodes">' +
                    '<node ng-repeat="child in node.childNodes" td-node="child"></node>' +
                    '</div>'
                );
            }else{
                iElement.append( angular.element('<div class="terminal-node">{{node.label}}</div>'));
            }
            
            $compile(iElement.contents())(scope.$new());
        }
    };
});

function squarify( nodes, laidNodes, boxingRect){
    
    var node = nodes.shift();
    
    // start by aligning the box along the height
    // add the node to the current row
    if( worst( laidNodes, boxingRect.height) <= worst( laidNodes.concat( node), boxingRect.height)){
        if( nodes.length > 1)
            squarify( nodes.slice(1), laidNodes.concat( node), );
    } else 
    // or fix the row and start a new row
    {
        
    }
}

// highest aspect ratio
function worst( nodes, length){
    
    var areas = nodes.map( function( node){
        return node.weightScale;
    });
    
    var areaSum = 0;
    areas.forEach( function( area){
        areaSum += area;
    });
    
    var max = Math.max.apply(null, areas);
    var min = Math.min.apply(null, areas);
    
    // see squarified treemap algorithm
    var w = Math.max( 
        length * length * max / (areaSum * areaSum) 
        , areaSum * areaSum / ( length * length * min));
    
    return w;
}

