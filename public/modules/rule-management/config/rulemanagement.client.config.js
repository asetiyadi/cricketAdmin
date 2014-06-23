'use strict';

// Rule management module config
angular.module('rule-management').run(['Menus',
	function(Menus) {
		Menus.addMenuItem('topbar', 'Device Management', 'deviceManagement', 'dropdown');
        Menus.addSubMenuItem('topbar', 'deviceManagement', 'Content Management', 'contentManagement');
        Menus.addSubMenuItem('topbar', 'deviceManagement', 'Rule Management', 'ruleManagement');
	}
]);