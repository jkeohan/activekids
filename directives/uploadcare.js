angular.module('myApp.ng-uploadcare', [])
  .directive('uploadcareWidget', function () {
    return {
      restrict: 'E',
      replace: true,
      require: 'ngModel',
      template: '<input type="hidden" role="ng-uploadcare-uploader" />',
      scope: {
        onWidgetReady: '&',
        onUploadComplete: '&',
        onChange: '&',
      },
      controller: ['$scope', '$element', '$log', function($scope, $element, $log) {
        if(!uploadcare) {
          $log.error('Uploadcare script has not been loaded!.');
          return;
        }
        $scope.widget = uploadcare.Widget($element);
        $scope.onWidgetReady({widget: $scope.widget});
        $scope.widget.onUploadComplete(function(info) {
          $scope.onUploadComplete({info: info});
        });
        $scope.widget.onChange(function(file) {
          $scope.onChange({file: file});
        })
      }]
    };
  });
