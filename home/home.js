'use strict';

angular.module('myApp.home', ['ngRoute','firebase', 'ui.bootstrap'])

.config(function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: '/home/home.html',
    controller: 'HomeCtrl',
  });
  $locationProvider.html5Mode(true);
})

.controller('HomeCtrl', function($scope, $firebase, FIREBASE_URL, $modal) {
	$scope.myInterval = 3000;

	var ref = new Firebase(FIREBASE_URL);
	$scope.submitted = false;
  $scope.submittedSuccess = false;

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

  $scope.learnMore = function () {
    var modalInstance = $modal.open({
      templateUrl: '/learn/learn.html',
      controller: 'LearnCtrl',
      size: 'lg'
    });
    modalInstance.result.then(function () {
    });
  };

});