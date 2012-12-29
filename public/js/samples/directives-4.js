angular.module('components', []);

angular.module('App', ['components']);

angular.module('components').filter('ifarray', function() {
    return function(input) {
        return $.isArray(input) ? input : [];
    }
}).directive('treenode', function($compile) {
    return {
        restrict: 'E',
        terminal: true,
        scope: {
            val: '='
        },
        link: function(scope, element, attrs) {
            if (angular.isArray(scope.val.items)) {

                element.append('<div>+ {{val.text}}<div ng-repeat="item in val.items"><treenode val="item"></tree></div></div>');
            }
            else {
                element.append('<span class="indent">- {{val.text}}</span>');
            }
            $compile(element.contents())(scope.$new());
        }
    }
}).directive('tree', function($compile) {
    return {
        restrict: 'E',
        terminal: true,
        scope: {
            val: '='
        },
        link: function(scope, element, attrs) {
            if (angular.isArray(scope.val)) {

                element.append('<div><div ng-repeat="item in val"><treenode val="item"></tree></div></div>');
            }
            $compile(element.contents())(scope.$new());
        }
    }
});



function appCtrl($scope) {
    $scope.treeData = [
        {
        text: "Furniture",
        items: [
            {
            text: "Tables & Chairs"
        },
            {
            text: "Sofas"
        },
            {
            text: "Occasional Furniture"
        }
        ]
    },
        {
        text: "Decor",
        items: [
            {
            text: "Bed Linen"
        },
            {
            text: "Curtains & Blinds"
        },
            {
            text: "Carpets"
        }
        ]
    },
        {
        text: "Storage",
        items: [
            {
            text: "Wall Shelving"
        },
            {
            text: "Floor Shelving"
        },
            {
            text: "Kids Storage"
        }
        ]
    },
        {
        text: "Lights",
        items: [
            {
            text: "Ceiling"
        },
            {
            text: "Table"
        },
            {
            text: "Floor"
        }
        ]
    }

    ];
}​