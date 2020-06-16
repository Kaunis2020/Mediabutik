/* 
 * Larissa Rosenbrant, laro0501;
 * Script för Main-applikationen (index.html);
 */
var mainApp = angular.module('mainApp', []);

mainApp.controller('mainController', ['$scope', '$filter', '$interval', function ($scope, $filter, $interval) {
        var tick = function () {
            var date_format = 'EEEE MMMM d, y hh:mm:ss a';
            $scope.get_date_time = $filter('date')(new Date(), date_format);
        };
        tick();
        $interval(tick, 1000);
}]);


