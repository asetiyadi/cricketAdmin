'use strict';

//Setting up route
angular.module('imei-lookup').config(['$stateProvider',
	function($stateProvider) {
		// Imei lookup state routing
		$stateProvider.
		state('imei-lookup', {
			url: '/imeilookup',
			templateUrl: 'modules/imei-lookup/views/imei-lookup.client.view.html'
		});
	}
]);