/* 
 *Larissa Rosenbrant;
 */
var app = angular.module('kontApp', []);
/* Controller för att läsa kontaktformulär, länder m.m. */
app.controller('kontCtrl', function ($scope, $http) {

    $http.get('/countries')
            .then(function (response) {
                $scope.countries = [];
                $scope.countries = response.data;
                $scope.selected = $scope.countries[0];
            }, function (error) {
            });

    $scope.reset = function () {
        $scope.yourname = "";
        $scope.email = "";
        $scope.selected = $scope.countries[0];
        $scope.subject = "";
        $scope.message = "";
    };

    $scope.submit = function () {

        if (!$scope.yourname && !$scope.email && !$scope.subject && !$scope.message)
            return;
        else
        {
            var data = {"name": $scope.yourname,
                "email": $scope.email,
                "country": $scope.selected,
                "subject": $scope.subject,
                "message": $scope.message
            };
            $http({
                method: 'POST',
                url: '/contact',
                data: data,
                headers: {'Content-Type': 'application/json'}
            })
                    .then(function (data) {
                        $scope.reset();
                        $scope.letter = data.data;
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

