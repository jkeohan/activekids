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

.controller('GraphsCtrl', function($scope, $firebase) {
  

});
