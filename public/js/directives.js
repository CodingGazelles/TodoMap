'use strict';

/* Directives */

todoApp.directive('map', function($compile) {
    return {
        restrict: 'E',
        terminal: true,
        scope: {
            node: '=tdNode'
        },
        template: '<div class="td-top-node"></div>',
        replace : true,
        link: function linkMap(scope, iElement, iAttrs) {
            console.log("call function link of directive map");
            
            function updateMap() {
                console.log("call function updateMap");
                
                if( scope.node.label !== undefined){
                    
                    iElement.contents().remove();
                    
                    // start squarifying
                    var mapBuilder = new MapBuilder(scope.node.childNodes, iElement);
                    mapBuilder.squarify();
                    
                    if (angular.isArray(scope.node.childNodes)) {
                        iElement.append( '<node ng-repeat="child in node.childNodes" td-node="child"></node>');
                    }
                    $compile(iElement.contents())(scope.$new());
                }
                
//                console.log("fin call function updateMap");
            }
            
            scope.$watch( 
                function(){ return scope.node.label}, 
                function watchMap(newValue, oldValue) {
                    console.log("callback function watchMap");
                    if ( newValue !== oldValue){
                        updateMap();
                    }
                }, 
                true
            );
            
            
            // version 1
            scope.$watch(
                function(){ 
                    var element = document.getElementById("td-map");
                    return {width: element.offsetWidth, height: element.offsetHeight};
                },
                function watchWindowResize( newValue, oldValue) {
                    console.log( "callback function watchWindowResize");
                    if ( newValue !== oldValue){
                        updateMap();
                    }
                },
                true
            );
            
            // version 2
//            scope.$watch(
//                function(){ return scope.mapSize},
//                function watchWindowResize( newValue, oldValue) {
//                    console.log( "callback function watchWindowResize");
//                    if ( newValue !== oldValue){
//                        scope.$evalAsync( updateMap());
//                    }
//                },
//                true
//            );
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
        template: '<div class="td-node"></div>',
        replace: true,
        link: function(scope, iElement, attrs) {
//            console.log("call function link of directive node");
//            console.log("node: " + scope.node.label);
            
            iElement.css( 'background-color', scope.node.style.bgcolor);
            if( scope.node.box !== undefined ){
                iElement.css( 'top', scope.node.box.top.toFixed(0) + "px");
                iElement.css( 'left', scope.node.box.left.toFixed(0) + "px");
                iElement.css( 'width', scope.node.box.width.toFixed(0) + "px");
                iElement.css( 'height', scope.node.box.height.toFixed(0) + "px");
            }
            
            if (angular.isArray(scope.node.childNodes)) {
                
                iElement.append( '<div class="td-label">{{node.label}}</div>');
                
                var cNodesElement = angular.element( '<div class="td-child-nodes"></div>');
                iElement.append( cNodesElement);
                
                cNodesElement.append( '<node ng-repeat="child in node.childNodes" td-node="child"></node>');
                
                // start squarifying
                var mapBuilder = new MapBuilder(scope.node.childNodes, cNodesElement);
                mapBuilder.squarify();
                
            }else{
                iElement.append( angular.element('<div class="td-terminal-node">{{node.label}}</div>'));
            }
            
            $compile(iElement.contents())(scope.$new());
        }
    };
});



