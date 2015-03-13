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

.controller('ActivityCtrl', function($scope, $firebase) {
  

});
