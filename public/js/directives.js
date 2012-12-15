'use strict';

/* Directives */



angular.module('treeMap', ["treeServices"])
  .directive('tree', function($compile){
    return {
      restrict: 'E',
      scope: true,
      replace: true,
      template: 
      '<div class="tree-head {{node.split}}">' +
      '</div>' ,

      link: function(scope, element, attrs){
        console.log("call function link of directive tree: " + attrs.ngModel);

        function updateTree(){
          console.log("call function updateTree: " + attrs.ngModel);

          var childScope;
          var node = scope.$eval(attrs.ngModel);
          var collection = node.childNodes;
          var split = node.split;

          if( !collection) return;

          for (var i = 0; i < collection.length; i++) {
            childScope = scope.$new();
            childScope.node = collection[i];
            childScope.split = split;
            element.append( $compile('<node ng-node="node" ng-split="split" class="node"></node>')(childScope) );
          };
        }

        scope.$parent.$watch( attrs.ngModel, function(value){
          console.log("call callback function of $watch rootnode: " + attrs.ngModel);
          if(value) updateTree();
        }, true);

      }
    }
  })
  .directive('node', function($compile){
    return {
      restrict: 'E',
      scope: {
        node: '=ngNode',
        split: '=ngSplit'
      },
      replace: true,
      template: 
      '<div style="background-color:{{node.bgcolor}}">' +
      '</div>' ,

      link: function(scope, element, attrs){
        console.log("call function link of directive node");
        
        
        element.append( $compile('<div class="item {{split}}" style="width:{{node.width}};height:{{node.height}}">• {{node.item.label}}</div>')(scope));

        var childScope;
        var node = scope.$eval(attrs.model);
        var collection = node.childNodes;

        if( !collection) return;

        for (var i = 0; i < collection.length; i++) {
          childScope = scope.$new();
          childScope.node = collection[i];
          childScope.parentNode = node;
          element.append( $compile('<node model="node" class="node {{split}}" style="width:{{node.width}};height:{{node.height}}"></node>')(childScope) );
        };
      }

      
    }
  })
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
  ;

