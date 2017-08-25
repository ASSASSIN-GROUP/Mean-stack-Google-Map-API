var headerCtrl = angular.module('headerCtrl', [])
    .controller('headerCtrl', function($scope, $location){
        $scope.isActive = function(viewLocation){
            return viewLocation === $location.path();
        };
    });