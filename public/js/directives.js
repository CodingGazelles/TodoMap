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
                    iElement.append( '<node ng-repeat="child in node.childNodes" td-node="child" td-split="node.split"></node>');
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
            node: '=tdNode',
            split: '=tdSplit'
        },
        template: '<div class="node"></div>',
        replace: true,
        link: function(scope, iElement, attrs) {
            console.log("call function link of directive node");
            
            iElement.addClass( scope.split);
            iElement.css( 'background-color', scope.node.bgcolor);
            if( scope.split == 'h'){
                iElement.css( 'width', scope.node.relatWeight);
                iElement.css( 'height', '100%');
            } else if(scope.split == 'v'){
                iElement.css( 'width', '100%');
                iElement.css( 'height', scope.node.relatWeight);
            }
            
            var item = angular.element('<div class="item {{node.split}}">{{node.item.label}}</div>');
//            if( scope.node.split == 'h'){
//                item.css( 'width', scope.node.relatWeight);
//            }else if ( scope.node.split == 'v'){
//                item.css( 'height', scope.node.relatWeight);
//            }
            iElement.append(item);
                
            if (angular.isArray(scope.node.childNodes)) {
                iElement.append(
                    '<div class="childNodes">' +
                    '<node ng-repeat="child in node.childNodes" td-node="child" td-split="node.split"></node>' +
                    '</div>'
                    );
            }
            
            $compile(iElement.contents())(scope.$new());
        }
    };
});

