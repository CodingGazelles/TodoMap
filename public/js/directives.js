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
            
            iElement.addClass( scope.split);
            iElement.css( 'background-color', scope.node.bgcolor);
            
            iElement.append( angular.element('<div class="leaf">{{node.label}}</div>'));
                
            if (angular.isArray(scope.node.childNodes)) {
                iElement.append(
                    '<div class="childNodes">' +
                    '<node ng-repeat="child in node.childNodes" td-node="child"></node>' +
                    '</div>'
                    );
            }
            
            $compile(iElement.contents())(scope.$new());
        }
    };
});

