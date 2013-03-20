'use strict';

/* Controllers */

angular.module('App.Controllers', [])

.run(['$rootScope', '$debounce', function($rootScope, $debounce) {}])

.controller('AppCtrl', ['$rootScope', '$debounce', function($rootScope, $debounce) {}])

.controller('TodomapCtrl', ['$appScope', '$treeManager', function($appScope, $treeManager) {
	$treeManager.loadTree("51487c2c925366450d000001");
	$appScope.topScope().selectedNode = null;
}]);