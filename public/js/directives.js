'use strict';

/* Directives */

todoApp.directive('tdMap', function mapFactory($compile) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-top-node"></div>',
        replace: true,
        link: function linkMap(scope, iElement, iAttrs) {
            console.log("call function link of directive map");
            
            function updateMap() {
                console.log("call function updateMap");
                
                if (scope.node.label !== undefined) {
                    
                    iElement.contents().remove();
                    
                    // start squarifying
                    var mapBuilder = new MapBuilder(scope.node.childNodes, iElement[0].getBoundingClientRect());
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
        scope: { node: '=tdNode'},
        template: '<div class="td-node"></div>',
        replace: true,
        link: function(scope, iElement, attrs) {
            //            console.log("call function link of directive node");
            //            console.log("node: " + scope.node.label);

            scope.node.opened = true;           // temp

            function layoutNode() {
                console.log( "call function layoutNode:" + scope.node.label);
                //console.log( "node: " + JSON.stringify( scope.node));

                iElement.contents().remove();
                iElement.css('background-color', scope.node.style.bgcolor);

                var top = scope.node.box.top, 
                    left = scope.node.box.left,
                    width = scope.node.box.width, 
                    height = scope.node.box.height;
                var childElement, labelElement;
                
                // define the bounding box of this node
                iElement.css('top', top.toFixed(0) + "px");
                iElement.css('left', left.toFixed(0) + "px");
                iElement.css('width', width.toFixed(0) + "px");
                iElement.css('height', height.toFixed(0) + "px");

                // define the label box of the node
                labelElement = angular.element('<td-label td-node="node"></td-label>');
                iElement.append( labelElement);

                // define the childnode box of the node
                if (angular.isArray(scope.node.childNodes)) {
                    childElement = angular.element(
                        '<div class="td-child-nodes"><td-node ng-repeat="child in node.childNodes" td-node="child"></td-node></div>');
                    childElement.css('top', "20px");
                    childElement.css('height', (height - 20).toFixed(0) + "px");
                    iElement.append(childElement);

                    // start squarifying
                    var mapBuilder = new MapBuilder(scope.node.childNodes, childElement[0].getBoundingClientRect());
                    mapBuilder.squarify();
                }

                $compile(iElement.contents())(scope.$new());
            }
            
            scope.$on( 'toggleNode', function onToggleNode( event, args){
                console.log("callback listener onToggleNode");
                if( scope.node.path === args.targetPath){
                    event.stopPropagation();
                    scope.$apply( layoutNode());
                } 
            });
            
            layoutNode();
        }
    };
});

todoApp.directive('tdLabel', function labelFactory($compile) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-label"></div>',
        replace: true,
        link: function updateLabel(scope, iElement, attrs) {
            //console.log("call function updateLabel");
            //console.log( "node: " + JSON.stringify( scope.node));
            
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
                // scope.$emit('toggleNode', { "targetPath": scope.node.parent.path});
                scope.$emit('modifiedMap');
            }
            
            $compile(iElement.contents())(scope.$new());
        }
    };
});



