/* 
 * AngularJS för företagets kunder: privatpersoner och företag;
 */

var app = angular.module('userapp', []);

app.controller('UserCtrl', function ($scope, $http) {

    $scope.submit = function () {
        if (!$scope.username && !$scope.password)
            return;
        else
        {
            var data = {
                user: $scope.username,
                pass: $scope.password
            };
            $http.post("/users/login", data).then(function (response) {
                
                if (response.status === 200)
                {
                    window.location = '/users/ownpage';
                }

                $scope.letter = response.data;
                var mess = '<b>' + $scope.letter + '</b>';
                angular.element(document.getElementById("notes")).html(mess);
            },
                    function (error) {
                        $scope.error = error.data;
                        var mess = '<b>' + $scope.error + '</b>';
                        angular.element(document.getElementById("notes")).html(mess);
                    });
        }
    };
});
