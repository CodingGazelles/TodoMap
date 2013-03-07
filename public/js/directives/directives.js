'use strict';



/* Directives */
angular.module('App.Directives', [])

.directive('tdMap', function($compile, $appScope, $window, $debounce, $mapManager) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-top-node"></div>',
        replace: true,
        link: function (scope, iElement, iAttrs) {
            // console.log("Link directive tdMap");

            var contentScope;

            var _layoutMap = function () {
                console.log("tdMap: Layout map");
                
                if (scope.node) {

                    iElement.contents().remove();
                    if(contentScope){
                        contentScope.$destroy();
                        contentScope = null;
                    }
                    
                    // start squarifying
                    $mapManager.colorizeBranch(scope.node);
                    $mapManager.squarifyBranch(scope.node, iElement[0].getBoundingClientRect());
                    
                    if(angular.isArray(scope.node.nodes)) {
                        iElement.append('<td-node ng-repeat="child in node.nodes" td-node="child"></td-node>');
                    }

                    contentScope = scope.$new();
                    $compile(iElement.contents())(contentScope);
                }
            }

            var layoutMap = $debounce( _layoutMap, 400, false);

            // redraw map when loaded
            $appScope.topScope().$watch(
                function() {
                    return scope.node === undefined;
                },
                function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        console.log("tdMap: Watch map loaded");
                        _layoutMap();
                    }
                },
                true
            );

            // redraw node when # of child nodes changes
            scope.$watch(
                function(){
                    return scope.node ? scope.node.nodes.length : -1;
                },
                function(newValue, oldValue){
                    if (newValue !== oldValue) {
                        console.log("tdMap: Watch # of nodes changed: " + scope.node);
                        _layoutMap();
                    }
                },
                true
            );

            // redraw map when window's size changes
            angular.element($window).bind('resize', function(event) {
                console.log("tdMap: Catch window resize event");
                scope.$apply( function(){ layoutMap()});
                if($appScope.topScope().selectedNode) $mapManager.focusNode($appScope.topScope().selectedNode);
            });
        }
    };
})

.directive('tdNode', function($compile, $appScope, $mapManager, $eventManager) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-node-container"></div>',
        replace: true,
        link: function(scope, iElement, attrs) {
            // console.log("tdNode: Link directive tdNode");
            //            console.log("tdNode: node: " + scope.node.label);

            var contentScope;
            scope.node.element = iElement;

            function layoutNode() {
                // console.log( "Layout node:" + scope.node);

                // remove previous DOM
                iElement.contents().remove();
                if(contentScope){
                    contentScope.$destroy();
                    contentScope = null;
                }

                // define the bounding box of this node
                var top = scope.node.box.top, 
                    left = scope.node.box.left,
                    width = scope.node.box.width, 
                    height = scope.node.box.height;

                iElement.css('top', top.toFixed(0) + "px");
                iElement.css('left', left.toFixed(0) + "px");
                iElement.css('width', width.toFixed(0) + "px");
                iElement.css('height', height.toFixed(0) + "px");
                iElement.css('background-color', $mapManager.toHexString( scope.node.bgcolor));

                // define the inner box of the node
                var innerElement;
                innerElement = angular.element('<div class="td-node"></div>');
                innerElement.bind( 'click',function(){$eventManager.onClick(event, scope, iElement)});
                iElement.append( innerElement);

                // define the label box of the node
                var labelElement;
                labelElement = angular.element('<td-label td-node="node"></td-label>');
                innerElement.append( labelElement);

                // define the childnode box of the node
                var childElement;
                if (angular.isArray(scope.node.nodes)) {
                    childElement = angular.element(
                        '<div class="td-child-nodes">' +
                            '<td-node ng-repeat="child in node.nodes" td-node="child"></td-node>' +
                        '</div>'
                    );
                    childElement.css('top', "20px");
                    childElement.css('height', (height - 20).toFixed(0) + "px");
                    innerElement.append(childElement);

                    // start squarifying
                    $mapManager.colorizeBranch(scope.node);
                    $mapManager.squarifyBranch(scope.node, childElement[0].getBoundingClientRect());
                }

                contentScope = scope.$new();
                $compile(iElement.contents())(contentScope);
            }

            // redraw node when # of child nodes changes
            scope.$watch(
                function(){
                    return scope.node.nodes.length;
                },
                function(newValue, oldValue){
                    if (newValue !== oldValue) {
                        console.log("tdNode: Watch # of nodes changed: " + scope.node);
                        layoutNode();
                    }
                },
                true
            );
            
            layoutNode();
        }
    };
})

.directive('tdLabel', function($compile, $appScope, $eventManager) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-label"></div>',
        replace: true,
        link: function (scope, iElement, attrs) {
            //console.log("call function updateLabel");

            var contentScope;
            
            function layoutLabel(){
                // console.log( "Layout node label:" + scope.node);

                // remove previous DOM
                iElement.contents().remove();
                if(contentScope){
                    contentScope.$destroy();
                    contentScope = null;
                }

                var label;
                if(scope.node.selected){
                    label = angular.element('<input class="td-label-editor" type="text" ng-model="node.label">');
                }else{
                    label = angular.element('<p>{{node.label}}</p>');
                }

                label.bind( 'keydown',   function(){    $eventManager.onKeydown(   event, scope, iElement)});
                label.bind( 'keypress',  function(){    $eventManager.onKeypress(  event, scope, iElement)});
                label.bind( 'input',     function(){    $eventManager.onInput(     event, scope, iElement)});
                label.bind( 'focus',     function(){    $eventManager.onFocus(     event, scope, iElement)});
                label.bind( 'blur',     function(){    $eventManager.onBlur(     event, scope, iElement)});
                iElement.append( label);
                
                $compile(iElement.contents())(scope.$new());
            }

            // redraw label when selected changes
            scope.$watch(
                function(){
                    return scope.node.selected;
                },
                function(newValue, oldValue){
                    if (newValue !== oldValue) {
                        console.log("tdLabel: Watch node selected/unselected: " + scope.node);
                        layoutLabel();
                    }
                },
                true
            );

            layoutLabel();
        }
    };
})
;



