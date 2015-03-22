'use strict';

angular.module('myApp.users', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/users/:userId', {
    templateUrl: '/users/users.html',
    controller: 'UsersCtrl',
    resolve: {
      'currentAuth': ['CurrentAuth', function(CurrentAuth) {
        return CurrentAuth.$requireAuth();
      }]
    }
  });
  $locationProvider.html5Mode(true);
}])

.controller('UsersCtrl', function($scope, $routeParams, $firebase, currentAuth, FIREBASE_URL, $modal) {
  var ref = new Firebase(FIREBASE_URL);
  var uid = $routeParams.userId
  var userData = $firebase(ref.child('users').child(uid)).$asObject();
  var userDataArray = $firebase(ref.child('users').child(uid)).$asArray();

  $scope.userDataArray = userDataArray;

  userData.$loaded(
    function(data) {
      $scope.user = data;
  }); //userData($loaded)
}); // UsersCtrl
