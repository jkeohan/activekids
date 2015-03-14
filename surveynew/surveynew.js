'use strict';

angular.module('myApp.surveynew', ['ngRoute'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/surveynew', {
    templateUrl: '/surveynew/surveynew.html',
    controller: 'SurveyNewCtrl',
    resolve: {
      'currentAuth': ['CurrentAuth', function(CurrentAuth) {
        return CurrentAuth.$requireAuth();
      }]
    }
  });
  $locationProvider.html5Mode(true);
}])

.controller('SurveyNewCtrl', function($scope, $firebase, currentAuth, $location, $modal, $rootScope, FIREBASE_URL) {
  
  console.log('Auth in Survey: ', currentAuth);
  $scope.$emit('UNLOAD');
  var authData = currentAuth;

  var ref = new Firebase(FIREBASE_URL);
  $scope.submitted = false;
  $scope.imageReceived = false;
  $scope.checkboxesChecked = false;
  $scope.errorMessage = null;
  $scope.formInfo = "";
  $scope.emailSignup = false;

  $scope.surveyQuestion = 1;
  $scope.userInfo;
  $scope.hide = false;


  $scope.firstNameSubmit = function() {
    $scope.firstNameSubmitted = true;
    if ($scope.userInfo.firstName.$valid) {
      $scope.surveyQuestion = 2;
      $scope.firstNameSubmitted = false;
    };
  };

  $scope.ageSubmit = function() {
    $scope.ageSubmitted = true;
    if ($scope.formInfo.age) {
      $scope.surveyQuestion = 3;
      $scope.ageSubmitted = false;
    };
  };


  $scope.favoriteAnimalSubmit = function() {
    $scope.favoriteAnimalSubmitted = true;
    if ($scope.userInfo.favoriteAnimal.$valid) {
      $scope.surveyQuestion = 4;
      $scope.favoriteAnimalSubmitted = false;
    };
  };

  $scope.homeworkSubmit = function() {
    $scope.homeworkSubmitted = true;
    if ($scope.userInfo.homework.$valid) {
      $scope.surveyQuestion = 5;
      $scope.homeworkSubmitted = false;
    };
  };

  $scope.favoriteSeasonSubmit = function() {
    $scope.favoriteSeasonSubmitted = true;
    if ($scope.userInfo.favoriteSeason.$valid) {
      $scope.surveyQuestion = 6;
      $scope.favoriteSeasonSubmitted = false;
    };
  };

  $scope.climbOrRideSubmit = function() {
    $scope.climbOrRideSubmitted = true;
    if ($scope.userInfo.climbOrRide.$valid) {
      $scope.surveyQuestion = 7;
      $scope.climbOrRideSubmitted = false;
    };
  };

  $scope.dogKindSubmit = function() {
    $scope.dogKindSubmitted = true;
    if ($scope.userInfo.dogKind.$valid) {
      $scope.surveyQuestion = 8;
      $scope.dogKindSubmitted = false;
    };
  };

  $scope.photoSubmit = function() {
    $scope.photoSubmitted = true;
    if ($scope.imageReceived) {
      $scope.photoSubmitted = false;
      writeSurveyData();
    };
  };

  if (currentAuth.password) {
    $scope.emailSignup = true;
  }
  
  $scope.onUCUploadComplete = function(info){
    $scope.imageUrl = info.cdnUrl;
    $scope.imageReceived = true;
  }
  

  var writeSurveyData = function() {
    $scope.$emit('LOAD');
    surveyCaptureData();
    var usersRef = $firebase(ref.child('users'));
    console.log("writing data in survey", currentAuth);
    usersRef.$set(currentAuth.uid, $scope.formData);
    var profile = $firebase(ref.child('users').child(currentAuth.uid)).$asObject();
    profile.$loaded(
      function(data) {
        console.log("Auth listener: Profile found go to profile page", profile);
        $rootScope.profile = profile;
        $location.path('/profile');
      }
    )
  };


  var surveyCaptureData = function() {
    if (currentAuth.provider === "password") {
      var signUpEmail = currentAuth.password.email;
    } else if (currentAuth.provider === "facebook") {
      var signUpEmail = currentAuth.facebook.email || "";
    } else {
      var signUpEmail = " ";
    };
    var datetimeBeforeString = new Date();
    var datetime = datetimeBeforeString.toString();
    
    $scope.formData = {
              email: signUpEmail,
              userID: currentAuth.uid,
              firstName: $scope.formInfo.firstName.charAt(0).toUpperCase() + $scope.formInfo.firstName.slice(1),
              age: $scope.formInfo.age,
              favoriteAnimal: $scope.formInfo.favoriteAnimal,
              homework: $scope.formInfo.homework,
              favoriteSeason: $scope.formInfo.favoriteSeason,
              climbOrRide: $scope.formInfo.climbOrRide,
              dogKind: $scope.formInfo.dogKind,
              dateSignUp: datetime,
              activities: {"test": "test"},
              profilePic: $scope.imageUrl || ("https://graph.facebook.com/" + currentAuth.facebook.id +"/picture?type=large&width=200&height=200")
    }; // formData
  }; // surveyCaptureData

}); //SurveyCtrl
