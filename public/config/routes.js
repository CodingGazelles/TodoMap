angular.module('App.Routes', [])

.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {

    if (CONFIG.routing.html5Mode) {
        $locationProvider.html5Mode(true);
    } else {
        var routingPrefix = CONFIG.routing.prefix;
        if (routingPrefix && routingPrefix.length > 0) {
            $locationProvider.hashPrefix(routingPrefix);
        }
    }

    ROUTER.when('todomap_path', '/todomap', {
        controller: 'TodomapCtrl',
        templateUrl: CONFIG.prepareViewTemplateUrl('map')
    });

    ROUTER.alias('home_path', 'todomap_path');

    ROUTER.otherwise({
        redirectTo: '/todomap'
    });

    ROUTER.install($routeProvider);
}])

.run(['$rootScope', '$location', function ($rootScope, $location) {
    var prefix = '';
    if (!CONFIG.routing.html5Mode) {
        prefix = '#' + CONFIG.routing.prefix;
    }
    $rootScope.route = function (url, args) {
        return prefix + ROUTER.routePath(url, args);
    };

    $rootScope.r = $rootScope.route;

    $rootScope.c = function (route, value) {
        var url = ROUTER.routePath(route);
        if (url == $location.path()) {
            return value;
        }
    };
}]);