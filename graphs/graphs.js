'use strict';

angular.module('myApp.graphs', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/graphs', {
    templateUrl: '/graphs/graphs.html',
    controller: 'GraphsCtrl',
    resolve: {
      'currentAuth': ['CurrentAuth', function(CurrentAuth) {
        return CurrentAuth.$requireAuth();
      }]
    }
  });
  $locationProvider.html5Mode(true);
})

.controller('GraphsCtrl', function($scope, $firebase, FIREBASE_URL, currentAuth) {
   
   // Hey Joe, all the data for the logged in user is contained in $scope.profile
   // To access specific pieces of data you would use the syntax $scope.profile.age or $scope.profile.firstName
   // You'll have to figure out what type of data we want to save for each activity and then
   // Tamara will add that to each user's profile
   // Take a look at the profile data in the Chrome console from the line below:
   console.log("Profile data:", $scope.profile);

});
