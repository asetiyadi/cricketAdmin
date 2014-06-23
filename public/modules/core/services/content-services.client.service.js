'use strict';

angular.module('core').factory('ContentServices', [
    function () {
        // Shareddata service logic
        var accessControl = {
            addContentEnabled: false,
            addRuleEnabled: false,
            showContentDescription: false
        };

        var availableContent = [
            {contentShortDescr: 'Up to 3G Data Speeds ', contentLongDescr: '3G download speeds range from approximately 700 Kbps up to 1.7 Mbps.'},
            {contentShortDescr: 'Unlimited Talk and Messaging ', contentLongDescr: 'Get unlimited voice minutes with all the calling features you expect - voicemail, call waiting/forwarding, and 3-way calling'}
        ];

        var availableFactors = [
            {'id': 'LTE', 'tooltip': 'Long Term Evolution (4G)'},
            {'id': 'UMTS', 'tooltip': 'Universal Mobile Telecom System (3G)'},
            {'id': '2100', 'tooltip': 'Frequency Band 2100 (IMT)'},
            {'id': '1900', 'tooltip': 'Frequency Band 1900 (PCS)'},
            {'id': 'Data Only', 'tooltip': 'Data Only'},
            {'id': 'NSTE Capable', 'tooltip': 'NSTE Capable'},
            {'id': 'AMR 5.9', 'tooltip': 'Adaptive Multi-Rate 5.9'},
            {'id': 'AMR MM', 'tooltip': 'Adaptive Multi-Rate MM'}
        ];

        var availableRules = [
            { 'id': 'LTE Data only Device', 'content': [ '0' ], 'factor': [ '4', '0' ] },
            { 'id': 'LTE Voice 2100 NSET', 'content': [ '0' ], 'factor': [ '2', '5' ] },
            { 'id': 'LTE Voice 1900 Unlimited Text/Talk', 'content': [ '0', '1' ], 'factor': [ '1', '3' ] }
        ];

        var content = {
            contentShortDescr: '',
            contentLongDescr: ''
        };

        var contentSelectedIndex = '';

        // *** SESSION STORAGE *** ///
        var sessionStorage = null;

        // Public API
        return {
            getAccessControl: function () {
                return accessControl;
            },

            getAvailableContent: function () {
                return availableContent;
            },

            getAvailableFactors: function () {
                return availableFactors;
            },

            getAvailableRules: function () {
                return availableRules;
            },

            getContentSelectedIndex: function () {
                return contentSelectedIndex;
            },

            getSessionStorage: function () {
                if (sessionStorage.getItem('exportData')) {

                    var backingStore = sessionStorage.getItem('exportData');
                    var localStore = JSON.parse(backingStore);

                    availableContent = localStore.availableContent;
                    availableFactors = localStore.availableFactors;
                    availableRules = localStore.availableRules;
                }
            },

            updateSessionStorage: function () {
                if (sessionStorage) {
                    console.log('updating session storage');

                    sessionStorage.removeItem('exportData');

                    var exportData = {
                        availableFactors: availableFactors,
                        availableRules: availableRules,
                        availableContent: availableContent
                    };

                    sessionStorage.setItem('exportData', JSON.stringify(exportData));
                }
            },

            saveContent: function (newContent, contentSelectedIndex) {
                if (contentSelectedIndex !== '' && contentSelectedIndex !== 'ADD') {
                    availableContent[contentSelectedIndex] = newContent;
                } else {
                    availableContent.push(newContent);
                }

                this.resetScope();

                accessControl.addContentEnabled = false;

                return ' (content saved)';
            },

            cancelContent: function () {
                accessControl.addContentEnabled = false;

                this.resetScope();
            },

            resetScope: function () {
                accessControl.showContentDescription = false;
                contentSelectedIndex = '';

                content = {
                    contentShortDescr: '',
                    contentLongDescr: ''
                };
            }
        };
    }
]);