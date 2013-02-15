'use strict';

var TdKeyboard = function(){};
TdKeyboard.BACK_SPACE = 8;
TdKeyboard.DELETE = 46;
TdKeyboard.ENTER = 13;

/* Directives */
angular.module('App.Directives', [])

.directive('tdMap', function mapFactory($compile, $appScope, $window, $debounce, $mapManager) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-top-node"></div>',
        replace: true,
        link: function linkMap(scope, iElement, iAttrs) {
            console.log("Link directive tdMap");

            var _updateMap = function () {
                console.log("Update map");
                
                if (scope.node !== undefined) {
                    
                    iElement.contents().remove();
                    
                    // start squarifying
                    $mapManager.colorizeBranch(scope.node);
                    $mapManager.squarifyBranch(scope.node, iElement[0].getBoundingClientRect());
                    
                    if (angular.isArray(scope.node.nodes)) {
                        iElement.append('<td-node ng-repeat="child in node.nodes" td-node="child"></td-node>');
                    }
                    $compile(iElement.contents())(scope.$new());
                }
            }

            // todo: debounce of updateMap doesn't work, fix it
            var updateMap = $debounce( _updateMap, 100, false);

            // watch map loading
            $appScope.topScope().$watch(
                function() {
                    return scope.node === undefined;
                },
                function (newValue, oldValue) {
                    console.log("Catch map loading watch");
                    if (newValue !== oldValue) {
                        _updateMap();
                    }
                },
                true
            );

            angular.element($window).bind('resize', function(event) {
                console.log("Catch window resize event");
                //todo: use the debounce of updateMap
                scope.$apply( _updateMap);
            });
            
            // watch window size
            // scope.$watch(
            //     function() {
            //         var element = document.getElementById("td-map");
            //         return {
            //             width: element.offsetWidth,
            //             height: element.offsetHeight
            //         };
            //     },
            //     function watchWindowResize(newValue, oldValue) {
            //         console.log("callback function watchWindowResize");
            //         if (newValue !== oldValue) {
            //             updateMap();
            //         }
            //     },
            //     true
            // );
        }
    };
})

.directive('tdNode', function nodeFactory($compile, $mapManager) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-node"></div>',
        replace: true,
        link: function(scope, iElement, attrs) {
            // console.log("Link directive tdNode");
            //            console.log("node: " + scope.node.label);

            function layoutNode() {
                // console.log( "Layout node:" + scope.node);
                // console.log( "call function layoutNode:" + Object.prototype.toString.call(scope.node) + "/" + scope.node.label);
                //console.log( "node: " + JSON.stringify( scope.node));

                iElement.contents().remove();
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

                $compile(iElement.contents())(scope.$new());
            }
            
            scope.$on( 'redrawNode', function( event, args){
                if( scope.node.path() === args.targetPath){
                    console.log("Catch event redraw node: " + scope.node);
                    // event.stopPropagation();
                    scope.$apply( layoutNode());
                } 
            });
            
            layoutNode();
        }
    };
})

.directive('tdLabel', function labelFactory($compile,$eventManager) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-label"></div>',
        replace: true,
        link: function (scope, iElement, attrs) {
            //console.log("call function updateLabel");
            //console.log( "node: " + JSON.stringify( scope.node));
            
//            var button = angular.element( '<i></i>');
            //button.addClass( "icon-white");
//            button.addClass( scope.node.opened ? "icon-minus-sign" : "icon-plus-sign");
//            iElement.append( button);
//            button.bind('click', toggle);
            
			var label = angular.element( '<input class="td-label-editor" type="text" ng-model="node.label" placeholder="{{node.label}}">');
            scope.node.labelElement = label;

			label.bind( 'change',    function(){    $eventManager.onChange(    event, scope.node)});
            label.bind( 'keydown',   function(){    $eventManager.onKeydown(   event, scope.node)});
			label.bind( 'keypress',  function(){    $eventManager.onKeypress(  event, scope.node)});
            label.bind( 'input',     function(){    $eventManager.onInput(     event, scope.node)});
			iElement.append( label);

            scope.$on( 'focusOnLabel', function( event, args){
                if( scope.node.path() === args.targetPath){
                    console.log("Catch event focus on node: " + scope.node);
                    // event.stopPropagation();
                    label[0].focus();
                } 
            });
            
            // Toggle the closed/opened state
            // function toggle() {
            //     scope.node.opened = !scope.node.opened;
            //     button.addClass( scope.node.opened ? "icon-minus-sign" : "icon-plus-sign");
            //     button.removeClass( scope.node.opened ? "icon-plus-sign" : "icon-minus-sign");
            //     // scope.$emit('toggleNode', { "targetPath": scope.node.parent.path});
            //     scope.$emit('saveMap');
            // }
            
            $compile(iElement.contents())(scope.$new());
        }
    };
});



