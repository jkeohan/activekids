'use strict';

angular.module('myApp.people', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/people', {
    templateUrl: '/people/people.html',
    controller: 'PeopleCtrl',
    resolve: {
      'currentAuth': ['CurrentAuth', function(CurrentAuth) {
        return CurrentAuth.$requireAuth();
      }]
    }
  });
}])

.controller('PeopleCtrl', function($scope, $firebase, $location, currentAuth, FIREBASE_URL, $modal) {
  var ref = new Firebase(FIREBASE_URL);
  var sync = $firebase(ref.child('users'));
  var usersArray = sync.$asArray();

  function chunk(arr, size) {
    var newArr = [];
    for (var i=0; i<arr.length; i+=size) {
      newArr.push(arr.slice(i, i+size));
    }
    return newArr;
  }

  usersArray.$loaded(
    function(data) {
      $scope.chunkedData = chunk(data, 4)
    } // function(data)
  ); //usersArray.$loaded

});
