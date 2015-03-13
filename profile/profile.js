'use strict';

angular.module('myApp.profile', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/profile', {
    templateUrl: '/profile/profile.html',
    controller: 'ProfileCtrl',
    resolve: {
      'currentAuth': ['CurrentAuth', function(CurrentAuth) {
        return CurrentAuth.$requireAuth();
      }]
    }
  });
  $locationProvider.html5Mode(true);
}])

.controller('ProfileCtrl', function($scope, $routeParams, $firebase, currentAuth, FIREBASE_URL, $modal) {
    var ref = new Firebase(FIREBASE_URL);
    $scope.updateProfileSuccess = false;

  $scope.updateProfile = function() {
    $scope.profile.$save(); 
    $scope.updateProfileSuccess = true;
  };

  $scope.onUCUploadComplete = function(info){
      $scope.imageUrl = info.cdnUrl;
      var imageUrl = $scope.imageUrl;
      var uid = $scope.profile.$id;
      $scope.imageReceived = true;
      var ref = new Firebase(FIREBASE_URL);
      var profileRef = $firebase(ref.child('users').child(uid).child('profilePic'));
      profileRef.$set(imageUrl);
    }

}); // UsersCtrl

