'use strict';

//Setting up route
angular.module('content-management').config(['$stateProvider',
    function($stateProvider) {
        // Content management state routing
        $stateProvider.
        state('content-management', {
            url: '/contentManagement',
            templateUrl: 'modules/content-management/views/content-management.client.view.html'
        });
    }
]);