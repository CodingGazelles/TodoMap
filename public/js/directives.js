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
                
                // start squarifying
                var mapBuilder = new MapBuilder(scope.node.childNodes, iElement);
                mapBuilder.squarifyNodes();
                
                if (angular.isArray(scope.node.childNodes)) {
                    iElement.append( '<node ng-repeat="child in node.childNodes" td-node="child"></node>');
                }
                $compile(iElement.contents())(scope.$new());
            }
            
            scope.$watch( function(){ return scope.node.label}, function watchMap(newValue, oldValue) {
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
            
            iElement.css( 'background-color', scope.node.bgcolor);
            if( scope.node.top !== undefined 
                && scope.node.left !== undefined
                    && scope.node.width !== undefined
                        && scope.node.height !== undefined){
                iElement.css( 'top', scope.node.top.toFixed(0) + "px");
                iElement.css( 'left', scope.node.left.toFixed(0) + "px");
                iElement.css( 'width', scope.node.width.toFixed(0) + "px");
                iElement.css( 'height', scope.node.height.toFixed(0) + "px");
            }
            
            if (angular.isArray(scope.node.childNodes)) {
                
                // start squarifying
//                var mapBuilder = new MapBuilder(scope.node.childNodes, iElement);
//                mapBuilder.squarifyNodes();
                
                iElement.append( '<div class="node">{{node.label}}</div>');
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



