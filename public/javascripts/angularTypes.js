/* 
 * Larissa Rosenbrant;
 */
var currentobject = null;
var ordlista = []; // Array med ordlista;
var type = "";
var sharedapp = angular.module('sharedapp', []);

$(document).ready(function () {
    $("#sokruta").keydown(function (event) {
        if (event.which === 13 || event.keyCode === 13) {
            sokValfritt();
        }
    });
});

/* Controller för att läsa böcker */
sharedapp.controller('BokCtrl', function ($scope, $http) {
    $http.get('/media/auto/BOK')
            .then(function (response) {
                type = "BOK";
                ordlista = response.data;
                show_choice(type, ordlista);
            }, function (error) {
            });
    $http.get('/media/BOK')
            .then(function (response) {
                $scope.items = response.data.dbmedia;
                $scope.$broadcast("changed", $scope.items);
            }, function (error) {
            });
});

/* Controller för att läsa DVD */
sharedapp.controller('DvdCtrl', function ($scope, $http) {
    $http.get('/media/auto/DVD')
            .then(function (response) {
                type = "DVD";
                ordlista = response.data;
                show_choice(type, ordlista);
            }, function (error) {
            });
    $http.get('/media/DVD')
            .then(function (response) {
                $scope.items = response.data.dbmedia;
                $scope.$broadcast("changed", $scope.items);
            }, function (error) {
            });
});

/* Controller för att läsa CD */
sharedapp.controller('Cd_Ctrl', function ($scope, $http) {
    $http.get('/media/auto/CD')
            .then(function (response) {
                type = "CD";
                ordlista = response.data;
                show_choice(type, ordlista);
            }, function (error) {
            });
    $http.get('/media/CD')
            .then(function (response) {
                $scope.items = response.data.dbmedia;
                $scope.$broadcast("changed", $scope.items);
            }, function (error) {
            });
});

/* Controller för PAGINERING av media */
sharedapp.controller('paginCtrl', function ($scope) {
    /* Variabel för hopp över element i listan;  */
    $scope.gap = 10;
    /* Element per varje sida;  */
    $scope.itemsPerPage = 10;
    $scope.pagedItems = [];
    $scope.currentPage = 0;
    $scope.items = [];

    /*  Förmedlar aktuellt objekt vidare för utskrift;  */
    $scope.setObject = function (myE)
    {
        currentobject = myE;
        showInfo(currentobject);
    };

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

    $scope.setPageNum = function (num) {
        $scope.currentPage = num;
    };

    $scope.setPage = function () {
        $scope.currentPage = this.n;
    };

    $scope.$on("changed", function (event, mitems) {
        $scope.items = mitems;
        $scope.groupToPages();
    });
});

/* Funktionen delas mellan de olika kontrollerna
 * för utskrift av detaljerad information om media;  */
function showInfo(myE) {
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
}

/* Funktionen visar detaljerad information för varje objekt;  */
function show_info(event){
    var obje = event.data.param1;
    var imgpath = "./images/" + obje.ID_Nr + ".jpg";
    var modal = document.getElementById('videoModal');
    var modalImg = document.getElementById("img01");
    var captionText = document.getElementById("videocaption");
    var huvtyp = document.getElementById('typ');
    var descrip = document.getElementById('story');
    var produc = document.getElementById('year');
    var price = document.getElementById('price');
    huvtyp.innerHTML = "Typ:  &nbsp;" + obje.Mediatyp;
    descrip.innerHTML = obje.Description;
    modalImg.src = imgpath;
    captionText.innerHTML = "Skapad av:  &nbsp;" + obje.Creator;
    produc.innerHTML = "Producerat: &nbsp;" + obje.Year;
    price.innerHTML = "Pris: " + obje.Pris + "  kr";
    modal.style.display = "block";
}

/*  Stänger informationsrutan;  */
function closethis() {
    var modal = document.getElementById('videoModal');
    modal.style.display = "none";
}

// Visar hel ordlista som AUTOCOMPLETE;
function show_choice(type, reslist) {
    $("#taggs").focus().autocomplete({
        autoFocus: true,
        minLength: 2,
        source: reslist,
        select: function (event, ui) {
            sendAuto(type, ui.item.label);
            $(this).val("");
            return false;
        }
    });
}

/* Söker via AUTOCOMPLETE; */
function sendAuto(type, label) {
    var ord = label;
    if (ord === null || ord === "")
        return;
    $.ajax({
        method: "GET",
        url: "/media/auto/" + type + "/search/" + ord,
        success:
                function (svar) {
                    if (svar !== null && svar !== "") {
                        createTable(svar);
                    } else {
                        var x = document.getElementById("nyaudio");
                        x.play();
                        alert("INGET RESULTAT!");
                    }
                }
    });
}

function createTable(data)
{
    if ($("#mediatable table").length) {
        $("#mediatable table").remove();
    }
    var table = $('<table></table>');
    var th1 = "<tr><th>ID-Nr</th><th>Titel</th><th>Typ</th><th>Genre</th><th>Info</th></tr>";
    table.append(th1);
    for (var x = 0; x < data.dbmedia.length; x++) {
        var col1 = $("<td></td>").text(data.dbmedia[x].ID_Nr);
        var col2 = $("<td></td>").text(data.dbmedia[x].Titel);
        var col3 = $("<td></td>").text(data.dbmedia[x].HuvudTyp);
        var col4 = $("<td></td>").text(data.dbmedia[x].Genre);
        var col5 = $("<td></td>").text("info");
        col5.click({param1: data.dbmedia[x]}, show_info);
        col5.addClass('klickamig');
        col5.attr('id', 'varna');
        var rad = $('<tr></tr>');
        rad.append(col1);
        rad.append(col2);
        rad.append(col3);
        rad.append(col4);
        rad.append(col5);
        table.append(rad);
    }
    $("#tabell table").hide();
    $("#pagin").hide();
    $("#mediatable").append(table);
}

/*  Söker på valfria ord; */
function sokValfritt() {
    var ord = document.getElementById("sokruta").value;
    if (ord === null || ord === "")
    {
        document.getElementById("sokruta").value = "";
        return;
    }
    if (ord !== null && ord !== "")
    {
        document.getElementById("sokruta").value = "";

        $.ajax({
            method: "GET",
            url: "/media/free/" + type + "/search/" + ord,
            success:
                    function (svar) {
                        if (svar !== null && svar !== "") {
                            createTable(svar);
                        } else {
                            var x = document.getElementById("nyaudio");
                            x.play();
                            alert("INGET RESULTAT!");
                        }
                    }

        });
    }
}
