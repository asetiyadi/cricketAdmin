'use strict';

angular.module('content-management').controller('ContentManagementController', ['$scope', 'ContentServices', function ($scope, ContentServices) {

    $scope.accessControl = ContentServices.getAccessControl();
    $scope.availableContent = ContentServices.getAvailableContent();
    $scope.contentSelectedIndex = ContentServices.getContentSelectedIndex();


    // *** GENERIC VARIABLES *** //
    $scope.status_text = '';
    $scope.accessControl.showContentDescription = false;
    $scope.accessControl.addContentEnabled = false;
    $scope.accessControl.testScope = false;

    console.dir($scope.accessControl);

    // placeholder for content description
    $scope.content = {
        contentShortDescr: '',
        contentLongDescr: ''
    };


    // -- Selecting a content from dropdown -- //

    $scope.selectContent = function () {

        $scope.accessControl.addContentEnabled = true;
        $scope.status_text = '';

        $scope.content = {
            contentShortDescr: '',
            contentLongDescr: ''
        };

        if ($scope.contentSelectedIndex === 'ADD') {
            $scope.accessControl.showContentDescription = true;

        } else {
            $scope.accessControl.showContentDescription = true;
            $scope.accessControl.addContentEnabled = false;

            $scope.content.contentShortDescr = $scope.availableContent[$scope.contentSelectedIndex].contentShortDescr;
            $scope.content.contentLongDescr = $scope.availableContent[$scope.contentSelectedIndex].contentLongDescr;
        }
    };


    // -- CREATE New Content -- //

    $scope.saveContent = function () {
        $scope.status_text = ContentServices.saveContent($scope.content, $scope.contentSelectedIndex);
        $scope.contentSelectedIndex = ContentServices.getContentSelectedIndex();
    };


    // -- DELETE Content -- //

    $scope.deleteContent = function () {
        if ($scope.contentSelectedIndex !== '' && $scope.contentSelectedIndex !== 'ADD') {
            $scope.availableContent.splice($scope.contentSelectedIndex, 1);
        }

        ContentServices.updateSessionStorage();
        ContentServices.resetScope();

        $scope.accessControl.addContentEnabled = false;
        $scope.status_text = ' (content deleted)';
    };


    $scope.cancelContent = function () {
        ContentServices.cancelContent();

        $scope.contentSelectedIndex = ContentServices.getContentSelectedIndex();
    };
}]);