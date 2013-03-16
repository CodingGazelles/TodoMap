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

            var layoutMap = function () {
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

            var layoutMap_db = $debounce( layoutMap, 400, false);

            // redraw map when loaded
            $appScope.topScope().$watch(
                function() {
                    return scope.node === undefined;
                },
                function (newValue, oldValue) {
                    if (newValue !== oldValue) {
                        console.log("tdMap: Watch map loaded");
                        layoutMap();
                    }
                },
                true
            );

            // redraw node when redraw flag changes
            scope.$watch(
                function(){
                    return scope.node ? scope.node.redraw : 0;
                },
                function(newValue, oldValue){
                    if (newValue !== oldValue) {
                        console.log("tdMap: Watch redraw flag node changed: " + scope.node);
                        layoutMap();
                    }
                },
                true
            );

            // redraw map when window's size changes
            angular.element($window).bind('resize', function(event) {
                console.log("tdMap: Catch window resize event");
                scope.$apply( function(){ layoutMap_db()});
                $mapManager.focusOnSelectedNode();
            });
        }
    };
})

.directive('tdNode', function($compile, $appScope, $debounce, $mapManager, $eventManager) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-node-container"></div>',
        replace: true,
        link: function(scope, iElement, attrs) {
            // console.log("tdNode: Link directive tdNode");
            //            console.log("tdNode: node: " + scope.node.header);

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
                // iElement.css('background-color', $mapManager.toHexString( scope.node.bgcolor));

                // define the inner box of the node
                var innerElement;
                innerElement = angular.element('<div class="td-node level{{node.level()}}"></div>');
                if( scope.node.level() <= 6){
                    innerElement.css('height', (height - 6).toFixed(0) + "px");
                    innerElement.css('width', (width - 6).toFixed(0) + "px");
                } 
                innerElement.bind( 'click',function(){$eventManager.onClick(event, scope, iElement)});
                iElement.append( innerElement);

                // define the header box of the node
                var headerElement;
                headerElement = angular.element('<td-header td-node="node"></td-header>');
                innerElement.append( headerElement);

                // define the childnode box of the node
                if(angular.isArray(scope.node.nodes) && scope.node.nodes.length > 0) {
                    var childElement;
                    childElement = angular.element(
                        '<div class="td-child-nodes">' +
                            '<td-node ng-repeat="child in node.nodes" td-node="child"></td-node>' +
                        '</div>'
                    );

                    // calculate how much space is left for the children
                    childElement.css('top', "20px");
                    if( scope.node.level() <= 6){
                        childElement.css('height', (height - 28).toFixed(0) + "px");
                        childElement.css('width', (width - 6).toFixed(0) + "px");
                    } else {
                        childElement.css('height', (height - 20).toFixed(0) + "px");
                    }
                    innerElement.append(childElement);

                    // start squarifying
                    $mapManager.colorizeBranch(scope.node);
                    $mapManager.squarifyBranch(scope.node, childElement[0].getBoundingClientRect());
                }

                contentScope = scope.$new();
                $compile(iElement.contents())(contentScope);
            }

            // var layoutNode_db = $debounce( layoutNode, 400, false);

            // redraw node when redraw flag changes
            scope.$watch(
                function(){
                    return scope.node ? scope.node.redraw : 0;
                },
                function(newValue, oldValue){
                    if (newValue !== oldValue) {
                        console.log("tdMap: Watch redraw flag node changed: " + scope.node);
                        layoutNode();
                    }
                },
                true
            );
            
            layoutNode();
        }
    };
})

.directive('tdHeader', function($compile, $appScope, $eventManager) {
    return {
        restrict: 'E',
        terminal: true,
        scope: { node: '=tdNode'},
        template: '<div class="td-header"></div>',
        replace: true,
        link: function (scope, iElement, attrs) {
            //console.log("call function updateheader");

            var contentScope;
            
            function layoutHeader(){
                // console.log( "Layout node header:" + scope.node);

                // remove previous DOM
                iElement.contents().remove();
                if(contentScope){
                    contentScope.$destroy();
                    contentScope = null;
                }

                var header;
                if(scope.node.selected){
                    header = angular.element('<input class="td-header-editor" type="text" ng-model="node.header">');
                }else{
                    if(scope.node.header!==""){
                        header = angular.element('<span>{{node.header}}</span>');
                    }else{
                        header = angular.element('<p>...</p>');
                    }
                }

                header.bind( 'keydown',   function(){    $eventManager.onKeydown(   event, scope, iElement)});
                header.bind( 'keypress',  function(){    $eventManager.onKeypress(  event, scope, iElement)});
                header.bind( 'input',     function(){    $eventManager.onInput(     event, scope, iElement)});
                header.bind( 'focus',     function(){    $eventManager.onFocus(     event, scope, iElement)});
                header.bind( 'blur',     function(){    $eventManager.onBlur(     event, scope, iElement)});
                iElement.append( header);
                
                $compile(iElement.contents())(scope.$new());
            }

            layoutHeader();
        }
    };
})
;



