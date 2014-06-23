'use strict';

//Setting up route
angular.module('rule-management').config(['$stateProvider',
	function($stateProvider) {
		// Rule management state routing
		$stateProvider.
		state('rule-management', {
			url: '/ruleManagement',
			templateUrl: 'modules/rule-management/views/rule-management.client.view.html'
		});
	}
]);