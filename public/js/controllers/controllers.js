'use strict';

/* Controllers */

angular.module('App.Controllers', [])

.run(['$rootScope', '$debounce', function($rootScope, $debounce) {}])

.controller('AppCtrl', ['$rootScope', '$debounce', function($rootScope, $debounce) {}])

.controller('TodomapCtrl', ['$appScope', '$treeManager', function($appScope, $treeManager) {
	$treeManager.loadTree("5137f1b9555711c447000001");
	$appScope.topScope().selectedNode = null;
}]);