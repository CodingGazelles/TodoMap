var myApp = angular.module('myApp',[]);

function MyCtrl($scope) {
    $scope.name = 'Superhero';
}
angular.module('components', [])
  .filter('ifarray', function() {
    return function(input) {
      return $.isArray(input)?input:[];
    }
  })
  .directive('tree', function($compile) {
    return {
      restrict: 'E',
      terminal: true,
      scope: {val:'evaluate'},
      link: function(scope, element, attrs) {
        if (angular.isArray(scope.val)) {
          // this is more complicated then it should be
          // see: https://github.com/angular/angular.js/issues/898
          element.append('<div>+ <div ng-repeat="item in val"><tree val="item"></tree></div></div>');
  } else {
          element.append('  - {{val}}');
          }
              $compile(element.contents())(scope.$new());
      }    }
  });
angular.module('myApp', ['components']);
      
