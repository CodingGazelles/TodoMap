'use strict';

/* Directives */

todoApp.directive('tree', function($compile) {
    return {
        restrict: 'E',
        terminal: true,
        scope: {
            node: '=tdNode'
        },
        template: '<div class="tree-head"></div>',
        replace : true,
        link: function linkTree(scope, iElement, iAttrs) {
            console.log("call function link of directive tree");
            
            function updateTree() {
                console.log("call function updateTree");
                
                if (angular.isArray(scope.node.childNodes)) {
                    iElement.append( '<node ng-repeat="child in node.childNodes" td-node="child" td-split="node.split"></node>');
                }
                $compile(iElement.contents())(scope.$new());
            }

            scope.$watch( 'node', function watchTree(newValue, oldValue) {
                console.log("call watch callback");
                if ( newValue !== oldValue) updateTree();
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
            
            iElement.append(
                '<div class="item {{node.split}}" style="width:{{node.width}};height:{{node.height}}">• {{node.item.label}}</div>'
            );
                
            if (angular.isArray(scope.node.childNodes)) {
                iElement.append('<node ng-repeat="child in node.childNodes" td-node="child" td-split="node.split"></node>');
            }
            
            $compile(iElement.contents())(scope.$new());
        }
    };
});

        //        template:
        //            '<div class="tree-head">' +
        //                //'<list td-node-list="node.childNodes" td-split="node.split"></list>' +
        //                '<node ng-repeat="child in node.childNodes" td-node="child" td-split="node.split"></node>' +
        //            '</div>'
        //        link: function linkTree(scope, iElement, iAttrs) {
        //            console.log("call function link of directive tree");
        //        }

        //        compile: function compileTree(tElement, tAttrs, transclude){
        //            console.log("call function compile of directive tree");
        //            
        //            $compile( tElement);
        //
        //            return function linkTree(scope, iElement, iAttrs) {
        //                console.log("call function link of directive tree");
        //
        ////                function updateTree() {
        ////                    console.log("call function updateTree: " + iAttrs.ngModel);
        ////                    var childScope;
        ////                    var node = scope.$eval(iAttrs.ngModel);
        ////                    var collection = node.childNodes;
        ////                    var split = node.split;
        ////                    if (!collection) return;
        ////                    for (var i = 0; i < collection.length; i++) {
        ////                        childScope = scope.$new();
        ////                        childScope.node = collection[i];
        ////                        childScope.split = split;
        ////                        iElement.append($compile('<node td-node="node" td-split="split" class="node"></node>')(childScope));
        ////                    };
        ////                }
        ////                scope.$parent.$watch(iAttrs.ngModel, function(value) {
        ////                    console.log("call callback function of $watch rootnode: " + iAttrs.ngModel);
        ////                    if (value) updateTree();
        ////                }, true);
        //            }
        //        }



//todoApp.directive('list', function nodeListFactory($compile) {
//    return {
//        restrict: 'E',
//        scope: {
//            nodeList: '=tdNodeList',
//            split: '=tdSplit'
//        },
//        replace: true,
//        template: '<node ng-repeat="node in nodeList" td-node="node"></node>'
//    }
//});
        //        compile: function compileNodeList(tElement, tAttrs){
        //            console.log("call function compile of directive nodeList");
        //            
        ////            for (var i = 0; i < nodeList.length; i++) {
        ////                tElement.append('<node td-node="node" class="node {{split}}" style="width:{{node.width}};height:{{node.height}}"></node>');
        ////            };
        ////            $compile(tElement);
        //            
        //            return function linkNodeList(scope, iElement, attrs) {
        //                console.log("call function link of directive nodeList");
        //            
        //            }
        //        }
        



            
        //        compile: function compileNode(tElement, attrs) {
        //            console.log("call function compile of directive node");
        //
        //            return function linkNode(scope, iElement, attrs) {
        //                console.log("call function link of directive node");
        //
        //            }
        //        }

//.directive('nodeOld', function($compile) {
//    return {
//        restrict: 'E',
//        scope: {
//            node: '=ngNode',
//            split: '=ngSplit'
//        },
//        replace: true,
//        template: '<div style="background-color:{{node.bgcolor}}">' + '</div>',
//        link: function(scope, element, attrs) {
//            console.log("call function link of directive node");
//            element.append($compile('<div class="item {{split}}" style="width:{{node.width}};height:{{node.height}}">• {{node.item.label}}</div>')(scope));
//            var childScope;
//            var node = scope.$eval(attrs.ngNode);
//            var collection = node.childNodes;
//            if (!collection) return;
//            for (var i = 0; i < collection.length; i++) {
//                childScope = scope.$new();
//                childScope.node = collection[i];
//                childScope.parentNode = node;
//                element.append($compile('<node ng-node="node" class="node {{split}}" style="width:{{node.width}};height:{{node.height}}"></node>')(childScope));
//            };
//        }
//    }
//})
// .directive('nodelist', function($compile){
//   return {
//     restrict: 'E',
//     // transclude: true,
//     // scope: {
//     //   nodes: '=nodesModel'
//     // },
//     scope: false,
//     replace: true,
//     template: '',
//     // templateUrl: '/directives/childNodes'
//     // template:
//     // '<div ng-repeat="elt in nodes">' +
//     //   '<node node-model="elt"></node>' +
//     // '</div>'
//     link: function(scope, element, attrs){
//       console.log("call function link of directive nodelist: " + attrs.model);
//       var childScope;
//       var collection = scope.$eval(attrs.model);
//       if( !collection) return;
//       for (var i = 0; i < collection.length; i++) {
//         childScope = scope.$new();
//         childScope.node = collection[i];
//         element.append( $compile('<node model="node"></node>')(childScope) );
//       };
//       // $compile(element.contents())(scope);
//     }
//     // link: function(scope, element, attrs){
//     //   console.log("call function link of directive nodelist");
//     //   for (var i = 0; i < nodes.length; i++) {
//     //     element.append( '<nodelist ng-model="node.childNodes"></nodelist>' );
//     //     nodes[i]
//     //   };
//     //   $compile(element.contents())(scope);
//     // }
//   }
// })

