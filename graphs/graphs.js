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

   // Take a look at the profile data in the Chrome console from the line below:
   console.log("Profile data:", $scope.profile);

   // With what you're building, we'll probably want to grab all the activity data stored
   // in a user's profile. Here's how to get that data as an Array
  // 1. Create a new reference to Firebase database
  var ref = new Firebase(FIREBASE_URL);
  // 2. Get the user's activities from firebase in the form of an Array
  
  var userActivitiesArray = $firebase(ref.child('users').child(currentAuth.uid).child('activities')).$asArray();

  userActivitiesArray.$loaded(
    function(data) {
      $scope.userActivitiesArray = data;
      console.log($scope.userActivitiesArray);
    } // function(data)
  ); //usersArray.$loaded

  // Now you can use ng-repeat on this data in your html file
  // Log in to the site with the following username and password or go to the "Activities" page
  // and add some activities to your profile to see this stuff working
  // username: lizzy@example.com   password: password
  // Note: there will always be one blank activity in the list - Don't worry about that for now

});
