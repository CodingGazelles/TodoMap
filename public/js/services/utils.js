'use strict';


// Add property last to arrays
Object.defineProperty(Array.prototype, 'last', {
    enumerable: false,
    configurable: true,
    get: function() {
        return this[this.length - 1];
    },
    set: undefined
});

angular.module( 'App.Utils', [])

.factory('$appScope', ['$rootScope', function($rootScope) {
    return {
        topScope: function() {
            return this.scope(document);
        },

        scope: function(element) {
            return angular.element(element).scope();
        },

        rootScope: function() {
            return $rootScope;
        },

        safeApply: function(fn, $scope) {
            $scope = $scope || this.topScope();
            fn = fn || function() {};
            if($scope.$$phase) {
                fn();
            } else {
                $scope.$apply(function() {
                    fn();
                });
            }
        }
    };
}])

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// N milliseconds. If `immediate` is passed, trigger the function on the
// leading edge, instead of the trailing.
// TODO: use the debounce of the underscore library

.factory('$debounce', ['$timeout', '$q', function($timeout, $q) {
    return function(func, wait, immediate) {
        var timeout;
        var deferred = $q.defer();
        // console.log("Building debounced version of " + arguments[0] + ", " + arguments[1] + ", " + arguments[2]);
        return function() {
            var context = this,
                args = arguments;
            var later = function() {
                    timeout = null;
                    if(!immediate) {
                        deferred.resolve(func.apply(context, args));
                        deferred = $q.defer();
                    }
                };
            var callNow = immediate && !timeout;
            if(timeout) {
                $timeout.cancel(timeout);
            }
            timeout = $timeout(later, wait);
            if(callNow) {
                deferred.resolve(func.apply(context, args));
                deferred = $q.defer();
            }
            return deferred.promise;
        };
    };
}])

// .factory('$debounce', function provideDebounce() {
// 	return function(func, wait, immediate){
//         // console.log("Building debounced version of fn: " + arguments[0].slice(0, Math.min(10, arguments[0].length)) + ", wait: " + arguments[1] + ", immediate: " + arguments[2]);
//         // console.log("Building debounced version of fn: " + arguments[0] + ", wait: " + arguments[1] + ", immediate: " + arguments[2]);
//         return _.debounce( func, wait, immediate);
//     };
// })
;