'use strict';

angular.module('myApp.signup', ['ngRoute'])

.controller('SignupCtrl', function($scope, Authentication, FIREBASE_URL, $firebaseAuth, $modalInstance) {


  var ref = new Firebase(FIREBASE_URL);
  $scope.authObj = $firebaseAuth(ref);
  $scope.submitted = false;
  $scope.submittedFacebook = false;
  $scope.submittedPassword = false;
  $scope.signUpEmailModel = null;
  $scope.errorMessage = null;
  $scope.loading = false;


  $scope.submitSignUpFacebook = function() {    
    $scope.$emit('LOAD');
    $scope.loading = true;
    var ref = new Firebase(FIREBASE_URL);
    ref.authWithOAuthPopup("facebook", function(error, authData) { 
      if (error) {
        $scope.submitted = true;
        $scope.submittedFacebook = true;
        console.log("Login Failed!", error);
        $scope.$emit('UNLOAD');
        $scope.loading = false;
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $modalInstance.close(authData);
      } 
    }, {
      scope: "email"
    });
  };


  $scope.submitSignUpPassword = function() {
    if (!$scope.signUpUserForm.$valid) {
       $scope.submitted = true;
       $scope.submittedPassword = true;
    } else {
      $scope.$emit('LOAD');
      $scope.loading = true;
      $scope.authObj.$createUser({
        email: $scope.signUpEmailModel,
        password: $scope.signUpPasswordModel
      }).then(function(userData) {
        console.log('userdata: ', userData.uid);
          return $scope.authObj.$authWithPassword({
            email: $scope.signUpEmailModel,
            password: $scope.signUpPasswordModel
          });
      }).then(function(authData) {
        console.log("Logged in as:", authData.uid);
        $modalInstance.close(authData);
      }).catch(function(error) {
        $scope.submitted = true;
        $scope.submittedPassword = true;
        console.error("Error: ", error);
        $scope.errorMessage = error.message;
        $scope.$emit('UNLOAD');
        $scope.loading = false;
      });
    }    
  };


}); // SignupCtrl

