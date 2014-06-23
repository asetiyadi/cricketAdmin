'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'cricketadmin';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName) {
      // Create angular module
      angular.module(moduleName, []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('articles');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('content-management');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('imei-lookup');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('rule-management');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Configuring the Articles module
angular.module('articles').run([
  'Menus',
  function (Menus) {
  }
]);'use strict';
// Setting up route
angular.module('articles').config([
  '$stateProvider',
  function ($stateProvider) {
    // Articles state routing
    $stateProvider.state('listArticles', {
      url: '/articles',
      templateUrl: 'modules/articles/views/list-articles.client.view.html'
    }).state('createArticle', {
      url: '/articles/create',
      templateUrl: 'modules/articles/views/create-article.client.view.html'
    }).state('viewArticle', {
      url: '/articles/:articleId',
      templateUrl: 'modules/articles/views/view-article.client.view.html'
    }).state('editArticle', {
      url: '/articles/:articleId/edit',
      templateUrl: 'modules/articles/views/edit-article.client.view.html'
    });
  }
]);'use strict';
angular.module('articles').controller('ArticlesController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Articles',
  function ($scope, $stateParams, $location, Authentication, Articles) {
    $scope.authentication = Authentication;
    $scope.create = function () {
      var article = new Articles({
          title: this.title,
          content: this.content
        });
      article.$save(function (response) {
        $location.path('articles/' + response._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
      this.title = '';
      this.content = '';
    };
    $scope.remove = function (article) {
      if (article) {
        article.$remove();
        for (var i in $scope.articles) {
          if ($scope.articles[i] === article) {
            $scope.articles.splice(i, 1);
          }
        }
      } else {
        $scope.article.$remove(function () {
          $location.path('articles');
        });
      }
    };
    $scope.update = function () {
      var article = $scope.article;
      article.$update(function () {
        $location.path('articles/' + article._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.find = function () {
      $scope.articles = Articles.query();
    };
    $scope.findOne = function () {
      $scope.article = Articles.get({ articleId: $stateParams.articleId });
    };
  }
]);'use strict';
//Articles service used for communicating with the articles REST endpoints
angular.module('articles').factory('Articles', [
  '$resource',
  function ($resource) {
    return $resource('articles/:articleId', { articleId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
//Setting up route
angular.module('content-management').config([
  '$stateProvider',
  function ($stateProvider) {
    // Content management state routing
    $stateProvider.state('content-management', {
      url: '/contentManagement',
      templateUrl: 'modules/content-management/views/content-management.client.view.html'
    });
  }
]);'use strict';  // Content management module config
               /*angular.module('content-management').run(['Menus',
    function(Menus) {
        Menus.addMenuItem('topbar', 'Device Management', 'deviceManagement', 'dropdown');
        Menus.addSubMenuItem('topbar', 'deviceManagement', 'Content Management', 'contentManagement');
        Menus.addSubMenuItem('topbar', 'deviceManagement', 'Rule Management', 'ruleManagement');
    }
]);*/'use strict';
angular.module('content-management').controller('ContentManagementController', [
  '$scope',
  'ContentServices',
  function ($scope, ContentServices) {
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
  }
]);'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/views/home.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
angular.module('core').factory('ContentServices', [function () {
    // Shareddata service logic
    var accessControl = {
        addContentEnabled: false,
        addRuleEnabled: false,
        showContentDescription: false
      };
    var availableContent = [
        {
          contentShortDescr: 'Up to 3G Data Speeds ',
          contentLongDescr: '3G download speeds range from approximately 700 Kbps up to 1.7 Mbps.'
        },
        {
          contentShortDescr: 'Unlimited Talk and Messaging ',
          contentLongDescr: 'Get unlimited voice minutes with all the calling features you expect - voicemail, call waiting/forwarding, and 3-way calling'
        }
      ];
    var availableFactors = [
        {
          'id': 'LTE',
          'tooltip': 'Long Term Evolution (4G)'
        },
        {
          'id': 'UMTS',
          'tooltip': 'Universal Mobile Telecom System (3G)'
        },
        {
          'id': '2100',
          'tooltip': 'Frequency Band 2100 (IMT)'
        },
        {
          'id': '1900',
          'tooltip': 'Frequency Band 1900 (PCS)'
        },
        {
          'id': 'Data Only',
          'tooltip': 'Data Only'
        },
        {
          'id': 'NSTE Capable',
          'tooltip': 'NSTE Capable'
        },
        {
          'id': 'AMR 5.9',
          'tooltip': 'Adaptive Multi-Rate 5.9'
        },
        {
          'id': 'AMR MM',
          'tooltip': 'Adaptive Multi-Rate MM'
        }
      ];
    var availableRules = [
        {
          'id': 'LTE Data only Device',
          'content': ['0'],
          'factor': [
            '4',
            '0'
          ]
        },
        {
          'id': 'LTE Voice 2100 NSET',
          'content': ['0'],
          'factor': [
            '2',
            '5'
          ]
        },
        {
          'id': 'LTE Voice 1900 Unlimited Text/Talk',
          'content': [
            '0',
            '1'
          ],
          'factor': [
            '1',
            '3'
          ]
        }
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
  }]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['user'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        for (var userRoleIndex in user.roles) {
          for (var roleIndex in this.roles) {
            if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
              return true;
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic || this.menus[menuId].isPublic,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic || this.menus[menuId].isPublic,
            roles: roles || this.defaultRoles,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
//Setting up route
angular.module('imei-lookup').config([
  '$stateProvider',
  function ($stateProvider) {
    // Imei lookup state routing
    $stateProvider.state('imei-lookup', {
      url: '/imeilookup',
      templateUrl: 'modules/imei-lookup/views/imei-lookup.client.view.html'
    });
  }
]);'use strict';
angular.module('imei-lookup').controller('ImeiLookupController', [
  '$scope',
  function ($scope) {
  }
]);'use strict';
//Setting up route
angular.module('rule-management').config([
  '$stateProvider',
  function ($stateProvider) {
    // Rule management state routing
    $stateProvider.state('rule-management', {
      url: '/ruleManagement',
      templateUrl: 'modules/rule-management/views/rule-management.client.view.html'
    });
  }
]);'use strict';
// Rule management module config
angular.module('rule-management').run([
  'Menus',
  function (Menus) {
    Menus.addMenuItem('topbar', 'Device Management', 'deviceManagement', 'dropdown');
    Menus.addSubMenuItem('topbar', 'deviceManagement', 'Content Management', 'contentManagement');
    Menus.addSubMenuItem('topbar', 'deviceManagement', 'Rule Management', 'ruleManagement');
  }
]);'use strict';
angular.module('rule-management').controller('RuleManagementController', [
  '$scope',
  'ContentServices',
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
    $scope.selected_rule = {};
    //to hold the selected rule from the dropdown
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
]);'use strict';
angular.module('rule-management').directive('checkList', function () {
  return {
    scope: {
      list: '=checkList',
      value: '@'
    },
    link: function (scope, elem, attrs) {
      var handler = function (setup) {
        var checked = elem.prop('checked');
        var index = scope.list.indexOf(scope.value);
        if (checked && index === -1) {
          if (setup) {
            elem.prop('checked', false);
          } else {
            scope.list.push(scope.value);
          }
        } else if (!checked && index !== -1) {
          if (setup) {
            elem.prop('checked', true);
          } else {
            scope.list.splice(index, 1);
          }
        }
      };
      var setupHandler = handler.bind(null, true);
      var changeHandler = handler.bind(null, false);
      elem.bind('change', function () {
        scope.$apply(changeHandler);
      });
      scope.$watch('list', setupHandler, true);
    }
  };
});'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/signin.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        //If successful we assign the response to the global user model
        $scope.authentication.user = response;
        //And redirect to the index page
        $location.path('/');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function () {
      $scope.success = $scope.error = null;
      var user = new Users($scope.user);
      user.$update(function (response) {
        $scope.success = true;
        Authentication.user = response;
      }, function (response) {
        $scope.error = response.data.message;
      });
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);