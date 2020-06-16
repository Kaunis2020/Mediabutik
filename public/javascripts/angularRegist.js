/* 
 * Larissa Rosenbrant;
 * Registrering av företagskunder eller privatpersoner:
 * Två olika formulär: För företag eller för privata personer.
 */

(function (angular) {
    'use strict';
    angular.module('regapp', [])
            .controller('RegisCtrl', ['$scope', '$http', function ($scope, $http) {
                    $scope.templates =
                            [{name: 'privatperson', url: 'privatform.html'},
                                {name: 'företagskund', url: 'firmaform.html'}];
                    $scope.template = $scope.templates[0];

                    $http.get('/countries')
                            .then(function (response) {
                                $scope.countries = [];
                                $scope.countries = response.data;
                                $scope.selected = $scope.countries[0];
                            }, function (error) {
                            });

                    $scope.resetpr = function () {
                        $scope.firstname = "";
                        $scope.lastname = "";
                        $scope.email = "";
                        $scope.selected = $scope.countries[0];
                    };

                    $scope.resetco = function () {
                        $scope.company = "";
                        $scope.kontaktperson = "";
                        $scope.email = "";
                        $scope.selected = $scope.countries[0];
                    };

                    $scope.submitprivate = function () {
                        if (!$scope.firstname && !$scope.lastname && !$scope.email)
                            return;
                        else
                        {
                            var fullname = $scope.firstname.concat(' ', $scope.lastname);
                            var data = {
                                type: "private",
                                firm: "",
                                name: fullname,
                                email: $scope.email,
                                country: $scope.selected
                            };
                            $http({
                                method: 'POST',
                                url: '/users',
                                data: data,
                                headers: {'Content-Type': 'application/json'}
                            })
                                    .then(function (data) {
                                        $scope.resetpr();
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

                    $scope.submitfirm = function () {
                        if (!$scope.company && !$scope.kontaktperson && !$scope.email)
                            return;
                        else
                        {
                            var data = {
                                type: "firm",
                                firm: $scope.company,
                                name: $scope.kontaktperson,
                                email: $scope.email,
                                country: $scope.selected
                            };
                            $http({
                                method: 'POST',
                                url: '/users',
                                data: data,
                                headers: {'Content-Type': 'application/json'}
                            })
                                    .then(function (data) {
                                        $scope.resetco();
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
                }]);
})(window.angular);
