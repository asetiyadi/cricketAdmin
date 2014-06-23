'use strict';

angular.module('rule-management').controller('RuleManagementController', ['$scope', 'ContentServices',
    function ($scope, ContentServices) {

        $scope.accessControl = ContentServices.getAccessControl();
        $scope.availableContent = ContentServices.getAvailableContent();
        $scope.availableFactors = ContentServices.getAvailableFactors();
        $scope.availableRules = ContentServices.getAvailableRules();

        $scope.rule = {
            id: '',
            content: [],
            factor: []
        };

        $scope.content = {
            contentShortDescr: '',
            contentLongDescr: ''
        };

        /** Selected option for content and factors **/
        $scope.selected_content = [];
        $scope.selected_factors = [];
        $scope.selected_rule = {};      //to hold the selected rule from the dropdown
        $scope.status_text = '';
        $scope.ruleSelectedIndex = '';


        // -- Selecting rule from dropdown -- //

        $scope.selectRule = function () {
            $scope.accessControl.addRuleEnabled = true;

            if ($scope.ruleSelectedIndex === 'ADD') {
                $scope.rule.id = '';
                $scope.selected_content = [];
                $scope.selected_factors = [];

            } else {
                $scope.selected_rule = $scope.availableRules[$scope.ruleSelectedIndex];
                $scope.selected_factors = $scope.selected_rule.factor;
                $scope.selected_content = $scope.selected_rule.content;

                console.log('ruleSelectedIndex = ' + $scope.ruleSelectedIndex);
                console.log('$scope.selected_factors = ' + $scope.selected_factors);
                console.log('$scope.selected_content = ' + $scope.selected_content);

                $scope.rule.id = $scope.selected_rule.id;
            }

            $scope.status_text = '';
        };


        // -- CREATE new rule --//

        $scope.saveRule = function () {
            var tempContent = $scope.selected_content;
            $scope.rule.content = tempContent;

            var tempFactor = $scope.selected_factors;
            $scope.rule.factor = tempFactor;

            var rule = $scope.rule;

            if ($scope.ruleSelectedIndex !== '' && $scope.ruleSelectedIndex !== 'ADD') {
                $scope.availableRules[$scope.ruleSelectedIndex] = rule;
            } else {
                $scope.availableRules.push(rule);
            }

            $scope.status_text = ' (rule saved)';
            $scope.accessControl.addRuleEnabled = false;

            /*if(sessionStorage)
            {
               sessionStorage.removeItem("exportData");

               var exportData = {
                    availableFactors: $scope.availableFactors,
                    availableRules: $scope.availableRules,
                    availableContent: $scope.availableContent       
               };

                sessionStorage.setItem("exportData", JSON.stringify(exportData) );
            }*/

            ContentServices.updateSessionStorage();

            $scope.ruleSelectedIndex = '';

            $scope.rule = {
                id: '',
                content: [],
                factor: []
            };

            $scope.selected_content = [];
            $scope.selected_factors = [];
        };


        // -- DELETE existing rule -- //

        $scope.deleteRule = function () {
            if ($scope.ruleSelectedIndex !== '' && $scope.ruleSelectedIndex !== 'ADD') {
                $scope.availableRules.splice($scope.ruleSelectedIndex, 1);
            }

            ContentServices.updateSessionStorage();

            $scope.accessControl.addRuleEnabled = false;
            $scope.ruleSelectedIndex = '';

            $scope.rule = {
                id: '',
                content: [],
                factor: []
            };
            $scope.selected_content = [];
            $scope.selected_factors = [];

            $scope.status_text = ' (rule deleted)';
        };

        $scope.resetForm = function () {
            $scope.accessControl.addRuleEnabled = false;
            $scope.status_text = '';
            $scope.ruleSelectedIndex = '';
        };


        // -- ADD Content -- //
        
        $scope.addContent = function () {
            $scope.accessControl.addContentEnabled = true;
            $scope.contentSelectedIndex = '';

            $scope.content = {
                contentShortDescr: '',
                contentLongDescr: ''
            };
        };


        // -- Canceling add content flow -- //

        $scope.cancelContent = function () {
            ContentServices.cancelContent();

            $scope.contentSelectedIndex = ContentServices.getContentSelectedIndex();
        };


        $scope.saveContent = function () {
            $scope.status_text = ContentServices.saveContent($scope.content, $scope.contentSelectedIndex);
            $scope.contentSelectedIndex = ContentServices.getContentSelectedIndex();
        };
    }
]);