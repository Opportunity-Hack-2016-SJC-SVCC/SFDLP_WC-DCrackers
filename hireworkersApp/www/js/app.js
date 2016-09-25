// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic','ngCordova','ionic.utils','ionic.rating']);

angular.module('ionic.utils', [])

.factory('LocalStorageFactory', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        },
        setArray: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getArray: function(key) {
            return JSON.parse($window.localStorage[key] || '[]');
        },
        removeItem: function(key) {
            $window.localStorage.removeItem(key);
        }
    }
}]);
app.constant('$ionicLoadingConfig', {
    template: 'Loading..',
    hideOnStateChange: true
});

app.constant('ApiEndpoint', {
    //url: 'http://192.168.0.101:8100/mobileapi' // For Live reload mac
  url: 'http://52.53.177.172:8080/Android_Web_Service/rest' // For Live Reload windows
    //url: 'http://notifyer.dev.salasarserver.com/mobileapi'
    //url: 'http://thenotifyer.com/mobileapi'
  //url: 'http://10.15.5.101/notifyapp/NOTIFYER-4/mobileapi'
});

app.constant('ApiEndpointPHP', {
    //url: 'http://192.168.0.101:8100/mobileapi' // For Live reload mac
  url: 'http://52.53.177.172' // For Live Reload windows
    //url: 'http://notifyer.dev.salasarserver.com/mobileapi'
    //url: 'http://thenotifyer.com/mobileapi'
  //url: 'http://10.15.5.101/notifyapp/NOTIFYER-4/mobileapi'
});

app.run(function($ionicPlatform, $ionicPopup, $rootScope) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);

      $rootScope.showAlert = function(msg, title) {
            //console.log('ShowAlert Called');
            var alertPopup = $ionicPopup.alert({
                title: title,
                template: msg
            });
        };


    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
});

app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {

    $ionicConfigProvider.views.maxCache(0);
    $ionicConfigProvider.views.transition('ios');
    $ionicConfigProvider.navBar.alignTitle('center');
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
        .state('app', {
        url: "/app",
        abstract: true,
        templateUrl: "appModules/common/menu.html"

    })

      .state('splash', {
            url: "/",
            templateUrl: "appModules/common/splash.html"
        })
        .state('register', {
            url: "/register",
            templateUrl: "appModules/register/register.html",
            controller: 'RegisterCtrl'
        })
        .state('verifyRegister', {
            url: "/verifyRegister",
            templateUrl: "appModules/register/verifyRegister.html",
            controller: 'RegisterCtrl'
        })
        .state('app.home', {
            url: "/home",
            views: {
                'menuContent': {
                    templateUrl: "appModules/home/home.html",
                    controller: 'HomeCtrl'
                }
            }
        })
        .state('app.home2', {
            url: "/home2",
            views: {
                'menuContent': {
                    templateUrl: "appModules/home/home2.html",
                    controller: 'Home2Ctrl'
                }
            }
        })
        .state('app.history', {
            url: "/history",
            views: {
                'menuContent': {
                    templateUrl: "appModules/home/history.html",
                    controller: 'HistoryCtrl'
                }
            }
        })
        .state('app.feedback', {
            url: "/feedback",
            views: {
                'menuContent': {
                    templateUrl: "appModules/home/feedback.html",
                    controller: 'FeedbackCtrl'
                }
            }
        })
        .state('app.logout', {
            url: "/logout",
            views: {
                'menuContent': {
                    templateUrl: "appModules/home/logout.html",
                    controller: 'LogoutCtrl'
                }
            }
        })
        .state('login', {
            url: "/login",
            templateUrl: "appModules/home/login.html",
            controller: 'LoginCtrl'
        })
        

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/home');
});


