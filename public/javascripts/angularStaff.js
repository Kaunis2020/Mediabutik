/* 
 * Angular för Mediabutikens Personal;
 */

var app = angular.module('myApp', []);

/* Controller för att läsa media */
app.controller('staffCtrl', function ($scope, $http) {

    $http.get('/staff')
            .then(function (response) {
                $scope.staff = response.data.dbstaff;
            }, function (error) {
            });

    $scope.showInfo = function (myE) {
        var imgpath = "./images/" + myE.Bild;
        var modal = document.getElementById('myModal');
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("caption");
        var capText = document.getElementById("caption2");
        modalImg.src = imgpath;
        captionText.innerHTML = myE.First_name + "  " + myE.Last_name;
        capText.innerHTML = myE.Department;
        modal.style.display = "block";
    };
});

function closethis() {
    var modal = document.getElementById('myModal');
    modal.style.display = "none";
}