'use strict';

var TdKeyboard = function(){};
TdKeyboard.BACK_SPACE = 8;
TdKeyboard.DELETE = 46;
TdKeyboard.ENTER = 13;

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
                    TdColor.colorize( scope.node);
                    var mapBuilder = new MapBuilder(scope.node.nodes(), iElement[0].getBoundingClientRect());
                    mapBuilder.squarify();
                    
                    if (angular.isArray(scope.node.nodes())) {
                        iElement.append('<td-node ng-repeat="child in node.nodes()" td-node="child"></td-node>');
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
                console.log( "Layout node:" + scope.node);
                // console.log( "call function layoutNode:" + Object.prototype.toString.call(scope.node) + "/" + scope.node.label);
                //console.log( "node: " + JSON.stringify( scope.node));

                iElement.contents().remove();
                iElement.css('background-color', TdColor.toHexString( scope.node.bgcolor));

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
                if (angular.isArray(scope.node.nodes())) {
                    childElement = angular.element(
                        '<div class="td-child-nodes"><td-node ng-repeat="child in node.nodes()" td-node="child"></td-node></div>');
                    childElement.css('top', "20px");
                    childElement.css('height', (height - 20).toFixed(0) + "px");
                    iElement.append(childElement);

                    // start squarifying
                    TdColor.colorize( scope.node);
                    var mapBuilder = new MapBuilder(scope.node.nodes(), childElement[0].getBoundingClientRect());
                    mapBuilder.squarify();
                }

                $compile(iElement.contents())(scope.$new());
            }
            
            scope.$on( 'redrawNode', function( event, args){
                if( scope.node.path() === args.targetPath){
                    console.log("Catch event redraw node: " + scope.node);
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
            
//            var button = angular.element( '<i></i>');
            //button.addClass( "icon-white");
//            button.addClass( scope.node.opened ? "icon-minus-sign" : "icon-plus-sign");
//            iElement.append( button);
//            button.bind('click', toggle);
            
			var label = angular.element( '<input class="td-label-editor" type="text" ng-model="node.label" placeholder="{{node.label}}">');
            scope.node.labelElement = label;

			label.bind( 'change', function(){
				console.log("Catch event label change");
                console.log( "Throw event save map");
				scope.$emit('saveMap');
			});
            label.bind( 'keydown', function(event){
                console.log("Catch event label keydown");
                if(
                    ( event.keyCode === TdKeyboard.BACK_SPACE || event.keyCode === TdKeyboard.DELETE )
                    && event.target.value === ""
                ){
                    console.log("Delete node: " + scope.node);

                    scope.node.delete();

                    console.log( "Throw event redraw node: " + scope.node.parent);
                    scope.$emit('redrawNode', { "targetPath": scope.node.parent.path()});

                    if( scope.node.previous){
                        scope.node.previous.focus();
                    } else if( scope.node.parent){
                        scope.node.parent.focus();
                    } else if( scope.node.next){
                        scope.node.next.focus();
                    }

                    console.log( "Throw event save map");
                    scope.$emit('saveMap');

                    if( event.preventDefaut) event.preventDefault();
                    if( event.returnValue) event.returnValue = false;
                };
            });
			label.bind( 'keypress', function(event){
				console.log("Catch event label keypress");

                if( event.keyCode === TdKeyboard.ENTER){
                    console.log("Create sibling to node: " + scope.node);

    				var newNode = scope.node.createSibling();

                    console.log( "Throw event redraw node: " + scope.node.parent);
    				scope.$emit('redrawNode', { "targetPath": scope.node.parent.path()});
                    console.log( "Throw event save map");
    				scope.$emit('saveMap');

                    newNode.labelElement[0].focus();

                    if( event.preventDefaut) event.preventDefault();
                    if( event.returnValue) event.returnValue = false;
                };
			});
            label.bind( 'input', function(event){
                console.log("Catch event label input");
            });
			iElement.append( label);
            
            // Toggle the closed/opened state
            function toggle() {
                scope.node.opened = !scope.node.opened;
                button.addClass( scope.node.opened ? "icon-minus-sign" : "icon-plus-sign");
                button.removeClass( scope.node.opened ? "icon-plus-sign" : "icon-minus-sign");
                // scope.$emit('toggleNode', { "targetPath": scope.node.parent.path});
                scope.$emit('saveMap');
            }
            
            $compile(iElement.contents())(scope.$new());
        }
    };
});



