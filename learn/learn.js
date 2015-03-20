'use strict';

angular.module('myApp.learn', ['ngRoute'])

.controller('LearnCtrl', function($scope, $modalInstance, $modal) {

  $scope.firstPageLearn = true;

  $scope.firstLearn = function() {
    $scope.firstPageLearn = false;
    $scope.secondPageLearn = true;
  }

  $scope.secondLearn = function() {
    $scope.secondPageLearn = false;
    $scope.thirdPageLearn = true;
  }

  $scope.thirdLearn = function() {
    $modalInstance.close();
  }

});

