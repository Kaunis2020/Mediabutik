/* 
 * Larissa Rosenbrant, laro0501;
 * Angular för Admin (INLOGGNING);
 */
var adminApp = angular.module('adminapp', []);

adminApp.controller('AdminCtrl', function ($scope, $http) {

    $scope.submit = function () {
        if (!$scope.username && !$scope.password)
            return;
        else
        {
            var data = {
                user: $scope.username,
                pass: $scope.password
            };
            $http.post("/admin", data).then(function (response) {
                if (response.status === 200)
                {
                    window.location = '/admin';
                } else {
                    $scope.error = response.data;
                    var mess = '<b>' + $scope.error + '</b>';
                    angular.element(document.getElementById("notes")).html(mess);
                }
            }, function (error) {
                $scope.error = error.data;
                var mess = '<b>' + $scope.error + '</b>';
                angular.element(document.getElementById("notes")).html(mess);
            });
        }
    };
});