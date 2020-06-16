/* 
 * Angular-Controller för media (böcker, CD- och DVD-skivor);
 * Skriver ut alla media som tabell med detaljerad information;
 */
var app = angular.module('myApp', []);

/* Controller för att läsa media */
app.controller('medCtrl', function ($scope, $http) {
    /* Variabel för hopp över element i listan;  */
    $scope.gap = 15;
    /* Element per varje sida;  */
    $scope.itemsPerPage = 15;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.items = [];

    $http.get('/media')
            .then(function (response) {
                $scope.media = response.data.dbmedia;
                $scope.items = $scope.media;
                $scope.groupToPages();
            }, function (error) {
            });

    // calculate page in place
    $scope.groupToPages = function () {
        for (var i = 0; i < $scope.items.length; i++) {
            if (i % $scope.itemsPerPage === 0) {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)] = [$scope.items[i]];
            } else {
                $scope.pagedItems[Math.floor(i / $scope.itemsPerPage)].push($scope.items[i]);
            }
        }
    };

    $scope.range = function (size, start, end) {
        var ret = [];
        if (size < end) {
            end = size;
            if (size < $scope.gap) {
                start = 0;
            } else {
                start = size - $scope.gap;
            }
        }
        for (var i = start; i < end; i++) {
            ret.push(i);
        }
        return ret;
    };

    $scope.prevPage = function () {
        if ($scope.currentPage > 0) {
            $scope.currentPage--;
        }
    };

    $scope.nextPage = function () {
        if ($scope.currentPage < $scope.pagedItems.length - 1) {
            $scope.currentPage++;
        }
    };

    $scope.setPageNum = function(num) {
        $scope.currentPage = num;
    };
    
    $scope.setPage = function() {
        $scope.currentPage = this.n;
    };

    $scope.showInfo = function (myE) {
        var idnr = myE.ID_Nr;
        var imgpath = "./images/" + idnr + ".jpg";
        var modal = document.getElementById('videoModal');
        var modalImg = document.getElementById("img01");
        var captionText = document.getElementById("videocaption");
        var huvtyp = document.getElementById('typ');
        var descrip = document.getElementById('story');
        var produc = document.getElementById('year');
        var price = document.getElementById('price');
        huvtyp.innerHTML = "Typ:  &nbsp;" + myE.Mediatyp;
        descrip.innerHTML = myE.Description;
        modalImg.src = imgpath;
        captionText.innerHTML = "Skapad av:  &nbsp;" + myE.Creator;
        produc.innerHTML = "Producerat: &nbsp;" + myE.Year;
        price.innerHTML = "Pris: " + myE.Pris + "  kr";
        modal.style.display = "block";
    };
});

function closethis() {
    var modal = document.getElementById('videoModal');
    modal.style.display = "none";
}