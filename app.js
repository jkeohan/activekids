'use strict';

angular.module('myApp', [
  'ngRoute',
  'myApp.home',
  'myApp.signup',
  'myApp.learn',
  'myApp.login',
  'myApp.users',
  'myApp.surveynew',
  'myApp.profile',
  'myApp.people',
  'myApp.graphs',
  'myApp.activity',
  'myApp.version',
  'myApp.ng-uploadcare',
  'myApp.ng-linechart',
  'ui.bootstrap',
  'firebase'
])
.run(function($rootScope, $location, $firebaseAuth, $firebase, FIREBASE_URL) {
  $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
    if (error === "AUTH_REQUIRED") {
      $location.path("/");
    }
  });
  var ref = new Firebase(FIREBASE_URL);
  var authObj = $firebaseAuth(ref);
  authObj.$onAuth(function(authData) {
    console.log("Auth listener: Called");
    if (authData) {
      $rootScope.currentUser = authData;
      var userId = authData.uid;
      var ref = new Firebase(FIREBASE_URL);
      var usersRef = ref.child('users');    
      usersRef.once('value', function(snapshot) {
        if (snapshot.hasChild(userId)) {
          var profile = $firebase(ref.child('users').child(userId)).$asObject();
          profile.$loaded(
            function(data) {
              console.log("Auth listener: Profile found go to profile page", profile);
              $rootScope.profile = profile;
              console.log("location: ", $location);
              var datetime = new Date();
              if ($location.$$path === "/" || $location.$$path === "/surveynew") {
                console.log("location go to profile: ", $location);
                $location.path('/profile');
              }
            }
          )
        } else {
          console.log("Auth listener: No profile go to survey page");
          $rootScope.profile = null;
          $location.path('/surveynew');
        }
      })  
    } else {
      $rootScope.currentUser = null;
      $rootScope.profile = null;
      console.log("Auth listener: No facebook data found");
      $location.path('/');
    }
  });
})
.config(function($routeProvider, $locationProvider) {
  $routeProvider.otherwise({redirectTo: '/'});
  $locationProvider.html5Mode(true);
})
.constant('FIREBASE_URL', 'https://radiant-inferno-7371.firebaseio.com/')
.factory("CurrentAuth", function($firebaseAuth, FIREBASE_URL) {
  var refAuth = new Firebase(FIREBASE_URL);
  return $firebaseAuth(refAuth);
})
.factory('Authentication', function($firebaseAuth, FIREBASE_URL) {
  var ref = new Firebase(FIREBASE_URL);
  var refAuth = $firebaseAuth(ref);

  var authObject = {
    login : function(user) {
      console.log("facebook login function called");
      return ref.authWithOAuthPopup("facebook", function(error, authData) { 
        if (error) {
          console.log("Login Failed!", error);
          $scope.$emit('UNLOAD');
        } else {
          console.log("Authenticated successfully with payload:", authData);
        } 
      }, {
        scope: "email"
      })
    },
    logout: function() {
      console.log("facebook logout function called");
      return refAuth.$unauth();  
    }
  };
  return authObject;
})
.controller("LoadingCtrl", ["$scope", function($scope) {
  $scope.$on('LOAD', function(){$scope.loading = true});
  $scope.$on('UNLOAD', function(){$scope.loading = false});
}])
.controller("NavCtrl", function($scope, $location, $firebaseAuth, Authentication, $modal, $log, FIREBASE_URL) {
  $scope.isCollapsed = true;

  $scope.$on('$routeChangeSuccess', function () {
        $scope.isCollapsed = true;
    });

  $scope.logout = function() {
    Authentication.logout();
  };

  $scope.openLogin = function () {
    var modalInstance = $modal.open({
      templateUrl: '/login/login.html',
      controller: 'LoginCtrl',
      size: 'sm'
    });
    modalInstance.result.then(function (authData) {
      $scope.authData = authData;
    });
  };

  $scope.openSignup = function () {
    var modalInstance = $modal.open({
      templateUrl: '/signup/signup.html',
      controller: 'SignupCtrl',
      size: 'sm'
    });
    modalInstance.result.then(function (authData) {
      $scope.authData = authData;
    });
  };



});
