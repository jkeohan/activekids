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

.controller('ProfileCtrl', function($scope, $routeParams, $firebase, currentAuth, FIREBASE_URL, $modal, $timeout) {
    var ref = new Firebase(FIREBASE_URL);
    $scope.updateProfileSuccess = false;

  $scope.onUCUploadCompleteProfile = function(info){
      $scope.imageUrl = info.cdnUrl;
      var imageUrl = $scope.imageUrl;
      var uid = $scope.profile.$id;
      $scope.imageReceived = true;
      var ref = new Firebase(FIREBASE_URL);
      var profileRef = $firebase(ref.child('users').child(uid).child('profilePic'));
      profileRef.$set(imageUrl);
    }

  // Create a reference to the activity data in firebase for this user
  var userActivitiesRef = $firebase(ref.child('users').child(currentAuth.uid).child('activities'));

 $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  $scope.minDate = null;

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    startingDay: 1,
    showWeeks: false
  };

  $scope.format = 'MMMM-dd-yyyy';

  $scope.onUCUploadComplete = function(info){
      $scope.imageUrl = info.cdnUrl;
  }

  // When the user clicks the "Submit Activity" button, run this code
  // It puts the data from the form (on HTML page) into the user's profile in firebase (under activities)
  $scope.activitySubmit = function () {

    // Grabbing the form information from the HTML page and putting it in JSON format
    var newActivity = { 
        activityType: $scope.activityForm.activityType,
        activityMinutes: $scope.activityForm.activityMinutes,
        activityMiles: $scope.activityForm.activityMiles,
        activityDate: $scope.activityForm.activityDate.toString().split(" ").slice(1, 4).join('-'),
        activityImage: $scope.imageUrl || ""
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
    $scope.activityForm.activityDate = null;

    // Give a message to the user for 2 seconds that the data was submitted successfully
    $scope.activitySuccess = true;
    $timeout(activitySuccessDisplay, 2000);

  }; // end of activitySubmit

  // This turns off the success message on the HTML page after 2 seconds
  function activitySuccessDisplay() {
    $scope.activitySuccess = false;
  };

  var userActivitiesArray = $firebase(ref.child('users').child(currentAuth.uid).child('activities')).$asArray();

  userActivitiesArray.$loaded(
    function(data) {
      $scope.userActivitiesArray = data;
      console.log($scope.userActivitiesArray);
    } // function(data)
  ); //usersArray.$loaded

}); // UsersCtrl

