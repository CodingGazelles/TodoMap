'use strict';

var TdKeyboard = function(){};
TdKeyboard.BACK_SPACE = 8;
TdKeyboard.DELETE = 46;
TdKeyboard.ENTER = 13;

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
            });
        }
    };
})

.directive('tdNode', function($compile, $mapManager) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-node"></div>',
        replace: true,
        link: function(scope, iElement, attrs) {
            // console.log("tdNode: Link directive tdNode");
            //            console.log("tdNode: node: " + scope.node.label);

            var contentScope;

            function layoutNode() {
                // console.log( "Layout node:" + scope.node);
                // console.log( "call function layoutNode:" + Object.prototype.toString.call(scope.node) + "/" + scope.node.label);
                //console.log( "node: " + JSON.stringify( scope.node));

                iElement.contents().remove();
                if(contentScope){
                    contentScope.$destroy();
                    contentScope = null;
                }

                iElement.css('background-color', $mapManager.toHexString( scope.node.bgcolor));

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
                if (angular.isArray(scope.node.nodes)) {
                    childElement = angular.element(
                        '<div class="td-child-nodes"><td-node ng-repeat="child in node.nodes" td-node="child"></td-node></div>');
                    childElement.css('top', "20px");
                    childElement.css('height', (height - 20).toFixed(0) + "px");
                    iElement.append(childElement);

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

.directive('tdLabel', function($compile,$eventManager) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-label"></div>',
        replace: true,
        link: function (scope, iElement, attrs) {
            //console.log("call function updateLabel");
            //console.log( "node: " + JSON.stringify( scope.node));
            
			var label = angular.element( '<input class="td-label-editor" type="text" ng-model="node.label" placeholder="{{node.label}}">');
            scope.node.labelElement = label;

			label.bind( 'change',    function(){    $eventManager.onChange(    event, scope.node)});
            label.bind( 'keydown',   function(){    $eventManager.onKeydown(   event, scope.node)});
			label.bind( 'keypress',  function(){    $eventManager.onKeypress(  event, scope.node)});
            label.bind( 'input',     function(){    $eventManager.onInput(     event, scope.node)});
            label.bind( 'focus',     function(){    $eventManager.onFocus(     event, scope.node)});
			iElement.append( label);

            scope.$on( 'focusOnLabel', function( event, args){
                if( scope.node.path() === args.targetPath){
                    console.log("tdLabel: Catch event focus on node: " + scope.node);
                    // event.stopPropagation();
                    label[0].focus();
                } 
            });
            
            $compile(iElement.contents())(scope.$new());
        }
    };
});



