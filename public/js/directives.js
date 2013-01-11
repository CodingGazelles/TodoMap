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
        replace: true,
        link: function linkMap(scope, iElement, iAttrs) {
            console.log("call function link of directive map");

            function updateMap() {
                console.log("call function updateMap");

                if (scope.node.label !== undefined) {

                    iElement.contents().remove();

                    // start squarifying
                    var mapBuilder = new MapBuilder(scope.node.childNodes, iElement);
                    mapBuilder.squarify();

                    if (angular.isArray(scope.node.childNodes)) {
                        iElement.append('<td-node ng-repeat="child in node.childNodes" td-node="child"></td-node>');
                    }
                    $compile(iElement.contents())(scope.$new());
                }
            }

            // watch map loading
            scope.$watch(
                function() {
                    return scope.node.label;
                },
                function watchMapLoading(newValue, oldValue) {
                    console.log("callback function watchMapLoading");
                    if (newValue !== oldValue) {
                        updateMap();
                    }
                },
                true
            );
            
            // watch window resize
            scope.$watch(
                function() {
                    var element = document.getElementById("td-map");
                    return {
                        width: element.offsetWidth,
                        height: element.offsetHeight
                    };
                },
                function watchWindowResize(newValue, oldValue) {
                    console.log("callback function watchWindowResize");
                    if (newValue !== oldValue) {
                        updateMap();
                    }
                },
                true
            );
        }
    };
});

todoApp.directive('tdNode', function nodeFactory($compile) {
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

            function updateNode() {
                console.log( "call function updateNode");
                console.log( "node: " + JSON.stringify( scope.node));

                iElement.contents().remove();

                iElement.css('background-color', scope.node.style.bgcolor);
                if (scope.node.box !== undefined) {
                    iElement.css('top', scope.node.box.top.toFixed(0) + "px");
                    iElement.css('left', scope.node.box.left.toFixed(0) + "px");
                    iElement.css('width', scope.node.box.width.toFixed(0) + "px");
                    iElement.css('height', scope.node.box.height.toFixed(0) + "px");
                }

                iElement.append('<td-label td-node="node"></td-label>');

                if (angular.isArray(scope.node.childNodes) && scope.node.opened) {
                    var cNodesElement = angular.element('<div class="td-child-nodes"></div>');
                    iElement.append(cNodesElement);

                    cNodesElement.append('<td-node ng-repeat="child in node.childNodes" td-node="child"></td-node>');

                    // start squarifying
                    var mapBuilder = new MapBuilder(scope.node.childNodes, cNodesElement);
                    mapBuilder.squarify();
                }

                $compile(iElement.contents())(scope.$new());
            }
            
            scope.$on( 'updateNode', function onUpdateNode( event){
                console.log("callback function onUpdateNode");
                event.stopPropagation();
                scope.$apply( updateNode());
            });
            
            updateNode();
        }
    };
});

todoApp.directive('tdLabel', function labelFactory($compile) {
    return {
        restrict: 'E',
        terminal: true,
        scope: {
            node: '=tdNode'
        },
        template: 
            '<div class="td-label"></div>',
        replace: true,
        transclude: true,
        link: function updateLabel(scope, iElement, attrs) {
            console.log("call function updateLabel");
            console.log( "node: " + JSON.stringify( scope.node));
            
            var button = angular.element( '<i></i>');
            //button.addClass( "icon-white");
            button.addClass( scope.node.opened ? "icon-minus-sign" : "icon-plus-sign");
            iElement.append( button);
            button.bind('click', toggle);
            
            iElement.append( '{{node.label}}');
            
            // Toggle the closed/opened state
            function toggle() {
                scope.node.opened = !scope.node.opened;
                button.addClass( scope.node.opened ? "icon-minus-sign" : "icon-plus-sign");
                button.removeClass( scope.node.opened ? "icon-plus-sign" : "icon-minus-sign");
                scope.$emit('updateNode');
            }
            
            $compile(iElement.contents())(scope.$new());
        }
    };
});



