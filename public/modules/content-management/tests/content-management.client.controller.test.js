'use strict';

(function () {
    // Content management Controller Spec
    describe('Content management Controller Tests', function () {
        // Initialize global variables
        var ContentManagementController,
            scope,
            $httpBackend,
            $stateParams,
            $location;

        var availableContent = [
            {contentShortDescr: 'Up to 3G Data Speeds ', contentLongDescr: '3G download speeds range from approximately 700 Kbps up to 1.7 Mbps.'},
            {contentShortDescr: 'Unlimited Talk and Messaging ', contentLongDescr: 'Get unlimited voice minutes with all the calling features you expect - voicemail, call waiting/forwarding, and 3-way calling'}
        ];

        // The $resource service augments the response object with methods for updating and deleting the resource.
        // If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
        // the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
        // When the toEqualData matcher compares two objects, it takes only object properties into
        // account and ignores methods.
        beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Then we can start by loading the main application module
        beforeEach(module(ApplicationConfiguration.applicationModuleName));

        // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
        // This allows us to inject a service but then attach it to a variable
        // with the same name as the service.
        beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
            // Set a new global scope
            scope = $rootScope.$new();

            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;

            // Initialize the Content management controller.
            ContentManagementController = $controller('ContentManagementController', {
                $scope: scope
            });
        }));

        it('$scope.selectContent should return content short and long description based on array index being passed', inject(function() {
            var sampleContent = {
                contentShortDescr: 'Up to 3G Data Speeds ', 
                contentLongDescr: '3G download speeds range from approximately 700 Kbps up to 1.7 Mbps.'
            };

            scope.contentSelectedIndex = 0;
            scope.selectContent();

            expect(scope.content).toEqual(sampleContent);   // The test logic
        }));

        it('$scope.saveContent - ADD: should increase array size and display the new array', inject(function() {
            var newContent = {
                contentShortDescr: 'Hotspot ', 
                contentLongDescr: 'Allow your device to be a wifi hotspot'
            };

            scope.content = newContent;
            scope.contentSelectedIndex = 'ADD';
            scope.saveContent();

            expect(scope.availableContent.length).toEqual(3);
            expect(scope.availableContent[2]).toBe(newContent);
        }));

        it('$scope.saveContent - UPDATE: should increase array size and display the new array', inject(function() {
             var sampleContent = {
                contentShortDescr: 'Up to 3G Data Speeds (by market) ', 
                contentLongDescr: '3G download speeds range from approximately 700 Kbps up to 1.7 Mbps. Download speed varies by market'
            };

            scope.content = sampleContent;
            scope.contentSelectedIndex = 0;
            scope.saveContent();

            expect(scope.availableContent[0]).toEqualData(sampleContent);
        }));

        it('$scope.deleteContent should delete the availableContent array by index', inject(function () {
            scope.contentSelectedIndex = 0;
            scope.deleteContent();

            expect(scope.availableContent.length).toEqual(1);
        }));

        it('$scope.cancelContent should clear up the index pointing to the content', inject(function () {
            scope.contentSelectedIndex = 1;
            scope.cancelContent();

            expect(scope.contentSelectedIndex).toEqual('');
        }));
    });
}());