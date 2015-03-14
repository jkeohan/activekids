'use strict';

angular.module('myApp.activity', ['ngRoute'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/activity', {
    templateUrl: '/activity/activity.html',
    controller: 'ActivityCtrl',
    resolve: {
      'currentAuth': ['CurrentAuth', function(CurrentAuth) {
        return CurrentAuth.$requireAuth();
      }]
    }
  });
  $locationProvider.html5Mode(true);
})

.controller('ActivityCtrl', function($scope, $firebase, FIREBASE_URL, currentAuth, $timeout) {

  // Create a new reference to Firebase database
  var ref = new Firebase(FIREBASE_URL);

  // Create a reference to the activity data in firebase for this user
  var userActivitiesRef = $firebase(ref.child('users').child(currentAuth.uid).child('activities'));

  // When the user clicks the "Submit Activity" button, run this code
  // It puts the data from the form (on HTML page) into the user's profile in firebase (under activities)
  $scope.activitySubmit = function () {

    // Grabbing the form information from the HTML page and putting it in JSON format
    var newActivity = { 
        activityType: $scope.activityForm.activityType,
        activityMinutes: $scope.activityForm.activityMinutes,
        activityMiles: $scope.activityForm.activityMiles
    };

    // Pushing the activity data into the user's profile in Firebase (activities section)
    // You'll see it add new entries under "Activities" in Firebase
    // The entries will have strange headers like "-JkKn1dNydIpkZTmznbx"
    // Just click the "+" sign in Firebase and you'll see the data you just pushed 
    userActivitiesRef.$push(newActivity);

    // After putting the data in firebase, clear out the HTML form so the user can make another update (if they want to)
    $scope.activityForm.activityType = null;
    $scope.activityForm.activityMinutes = null;
    $scope.activityForm.activityMiles = null;

    // Give a message to the user for 2 seconds that the data was submitted successfully
    $scope.activitySuccess = true;
    $timeout(activitySuccessDisplay, 2000);

  }; // end of activitySubmit

  // This turns off the success message on the HTML page after 2 seconds
  function activitySuccessDisplay() {
    $scope.activitySuccess = false;
  };

});
