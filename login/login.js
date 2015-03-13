'use strict';

angular.module('myApp.login', ['ngRoute'])

.controller('LoginCtrl', function($scope, Authentication, FIREBASE_URL, $modalInstance) {

  $scope.errorMessage = false;
  $scope.errorMessageReset = false;
  $scope.resetPasswordSubmitted = false;
  $scope.loginPasswordSubmitted = false;

  $scope.forgotPassword = function() {
    $scope.errorMessage = false;
    $scope.loginPasswordSubmitted = false;
    $scope.passwordReset = true;
  }

  $scope.backToLogin = function() {
    $scope.passwordReset = false;
    $scope.errorMessageReset = false;
    $scope.resetPasswordSubmitted = false;
  }

  $scope.submitResetPassword = function() {
    $scope.resetPasswordSubmitted = true;
    var ref = new Firebase(FIREBASE_URL);
    ref.resetPassword({
      email: $scope.userPasswordReset.email
      }, function(error) {
      if (error) {
        switch (error.code) {
          case "INVALID_USER":
            console.log("The specified user account does not exist.");
            $scope.errorMessageReset = "User account does not exist";
            break;
          default:
            console.log("Error resetting password:", error);
            $scope.errorMessageReset = error.message;
        }
      } else {
        console.log("Password reset email sent successfully!");
        $scope.errorMessageReset = "Password reset email sent!";
      }
    });
  };



  $scope.facebookLogin = function() {
    $scope.$emit('LOAD');
    var ref = new Firebase(FIREBASE_URL);
    ref.authWithOAuthPopup("facebook", function(error, authData) { 
        if (error) {
          console.log("Login Failed!", error);
          $scope.$emit('UNLOAD');
        } else {
          console.log("Authenticated successfully with payload:", authData);
          $modalInstance.close(authData)
        } 
      }, {
    })
  };


  $scope.submitLoginPassword = function () {
    $scope.loginPasswordSubmitted = true;
    $scope.$emit('LOAD');
    var ref = new Firebase(FIREBASE_URL);
    ref.authWithPassword({
      email    : $scope.loginUser.email,
      password : $scope.loginUser.password
    }, function(error, authData) {
      if (error) {
        console.log("Login Failed!", error);
        $scope.$emit('UNLOAD');
        $scope.errorMessage = error.message;
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $scope.loginPasswordSubmitted = false;
        $modalInstance.close(authData);
      }
    });
  }

}); // LoginCtrl
