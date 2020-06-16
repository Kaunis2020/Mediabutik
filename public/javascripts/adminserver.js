/* 
 * Admin-serverskript för Adminsida på servern;
 */
var admin = null;
var cookies = false;
resultlist = [];
departments = [];
const slag = [{"key": 5, "value": "Välj typ"}, {"key": 0, "value": "BOK"}, {"key": 1, "value": "CD"}, {"key": 2, "value": "DVD"}];
medialist = [];
$(document).ready(function () {
    getDepart();
});

/* Lista med avdelningar; */
function getDepart()
{
    $.ajax({
        method: "GET",
        url: "/staff/depart",
        success:
                function (svar) {
                    if (svar !== null && svar !== "") {
                        departments = svar;
                    } else {
                        return;
                    }
                }
    });
}

/* Generell information om anställda */
function getStaffData() {
    $.ajax({
        method: "GET",
        url: "/staff/all",
        dataType: 'json',
        success:
                function (svar) {
                    if (svar !== null && svar !== "") {
                        createTable(svar);
                    } else {
                        return;
                    }
                },
        error: function (error) {
            reset();
            $('#notes').html("<b>" + error + "</b>");
        }
    });
}

/* En automatisk lista för AUTOCOMPLETE  */
function getAutoList() {
    $.ajax({
        method: "GET",
        url: "staff/list",
        success:
                function (svar) {
                    if (svar !== null && svar !== "") {
                        resultlist = svar;
                        show_choice(resultlist);
                    } else {
                        return;
                    }
                }

    });
}

/* En automatisk lista för AUTOCOMPLETE  */
function getAutoMediaList() {
    $.ajax({
        method: "GET",
        url: "media/list",
        success:
                function (svar) {
                    if (svar !== null && svar !== "") {
                        medialist = svar;
                        show_mediachoice(medialist);
                    } else {
                        return;
                    }
                }

    });
}

function show_mediachoice(medialist)
{
    $("#medtaggs").focus().autocomplete({
        autoFocus: true,
        minLength: 2,
        source: medialist,
        select: function (event, ui) {
            $(this).val(ui.item.label);
            sendMediaAuto(ui.item.value);
            $(this).val("");
            return false;
        }
    });
}

function sendMediaAuto(id)
{
    $.ajax({
        method: "GET",
        url: "/media/" + id,
        success:
                function (svar) {
                    if (svar !== null && svar !== "") {
                        displayMedia(svar);
                    } else {
                        return;
                    }
                }
    });
}

function displayMedia(media)
{
    var h2 = $("<h2></h2>").html("Röda fält kan redigeras");
    if ($("#messages table").length) {
        $("#messages table").remove();
    }
    var table = $('<table></table>');
    table.attr('id', 'messtable');
    var th1 = "<tr><th>ID</th><th>Typ</th><th>Titel</th><th>Producent</th><th>Pris</th><th>Antal</th></tr>";
    table.append(th1);
    var col0 = $("<td></td>").text(media.ID_Nr);
    var col1 = $("<td></td>").text(media.Mediatyp);
    var col2 = $("<td></td>").text(media.Titel);
    var col3 = $("<td></td>").text(media.Creator);
    col3.css("width", "20%");
    var input0 = $("<Input type=text id='price' name='price' class='input'>");
    input0.val(media.Pris);
    input0.keydown({param1: media.ID_Nr}, ReadNewPrice);
    var col4 = $("<td></td>").append(input0);
    col4.css("width", "13%");
    var input1 = $("<Input type=text id='stock' name='stock' class='input'>");
    input1.val(media.Lagerantal);
    input1.keydown({param1: media.ID_Nr}, ReadNewStock);
    var col5 = $("<td></td>").append(input1);
    col5.css("width", "13%");
    col5.addClass('centrerat');
    var rad = $('<tr></tr>');
    rad.append(col0);
    rad.append(col1);
    rad.append(col2);
    rad.append(col3);
    rad.append(col4);
    rad.append(col5);
    table.append(rad);
    var modal = document.getElementById('messages');
    $("#messages").append(h2);
    $("#messages").append(table);
    modal.style.display = "block";
}

function ReadNewStock(event)
{
    if (event.which === 13 || event.keyCode === 13) {
        var lager = $("#stock").val();
        if (isNaN(lager))
        {
            alert("ENDAST SIFFROR!!!");
            return;
        } else {
            var data = {"ID": event.data.param1, "lager": lager};

            $.ajax({
                url: '/media/lager',
                type: 'PUT',
                data: data,
                success: function (result) {
                    reset();
                    displayMedia(result);
                },
                error: function (error) {
                    reset();
                    $('#notes').html("<b>" + error + "</b>");
                }
            });
        }
    }
}

function ReadNewPrice(event)
{
    if (event.which === 13 || event.keyCode === 13) {
        var price = $("#price").val();
        if (isNaN(price))
        {
            alert("ENDAST SIFFROR!!!");
            return;
        } else {
            var data = {"ID": event.data.param1, "price": price};

            $.ajax({
                url: '/media/pris',
                type: 'PUT',
                data: data,
                success: function (result) {
                    reset();
                    displayMedia(result);
                },
                error: function (error) {
                    reset();
                    $('#notes').html("<b>" + error + "</b>");
                }
            });
        }
    }
}

/* Produkt information */
function getProductInfo() {
    $.ajax({
        method: "GET",
        url: "/media/all",
        success:
                function (svar) {
                    if (svar !== null && svar !== "") {
                        createMediaTable(svar);
                    } else {
                        return;
                    }
                }
    });
}
/* Information om mediabutikens kunder */
function displayCustomers()
{
    $.ajax({
        method: "GET",
        url: "/users",
        success:
                function (svar) {
                    if (svar !== null && svar !== "") {
                        createCustTable(svar);
                    } else {
                        return;
                    }
                }
    });
}

/* Tabell med företagets kunder; */
function createCustTable(data)
{
    if ($("#messages table").length) {
        $("#messages table").remove();
    }
    var table = $('<table></table>');
    table.attr('id', 'messtable');
    var th1 = "<tr><th>Person</th><th>Typ</th><th>Företag</th><th>E-post</th><th>Land</th><th> Delete </th></tr>";
    table.append(th1);
    for (var x = 0; x < data.users.length; x++) {
        var col1 = $("<td></td>").text(data.users[x].Person);
        var col2 = $("<td></td>").text(data.users[x].Category);
        var col3 = $("<td></td>");
        col3.css("width", "20%");
        if (data.users[x].Category === "private")
        {
            col3.text("------");
        } else
        {
            col3.text(data.users[x].Company);
        }
        var col4 = $("<td></td>").text(data.users[x].Email);
        var col5 = $("<td></td>").text(data.users[x].Country);
        var col6 = $("<td></td>").text(" Delete ");
        col6.click({param1: data.users[x]._id}, deleteCustomer);
        col6.css("width", "15%");
        col6.addClass('klickamig centrerat');
        col6.attr('id', 'varna');
        var rad = $('<tr></tr>');
        rad.append(col1);
        rad.append(col2);
        rad.append(col3);
        rad.append(col4);
        rad.append(col5);
        rad.append(col6);
        table.append(rad);
    }
    var modal = document.getElementById('messages');
    $("#messages").append(table);
    modal.style.display = "block";
}

function deleteCustomer(event)
{
    var yes = window.confirm("Vill Du verkligen RADERA kunden?");
    if (yes === false) {
        return;
    } else if (yes === true) {
        var id = event.data.param1;
        if (id === null || id === "")
            return;
        else {
            $.ajax({
                method: "DELETE",
                url: "/users/" + id,
                dataType: 'text',
                success:
                        function (svar) {
                            if (svar !== null && svar !== "") {
                                $('#notes').html("<b>" + svar + "</b>");
                                displayCustomers();
                            } else {
                                return;
                            }
                        },
                error: function (error) {
                    reset();
                    $('#notes').html("<b>" + error + "</b>");
                }
            });
        }
    }
}

/* Tabell med mediabutikens produkter;  */
function createMediaTable(data)
{
    if ($("#output select").length) {
        $("#output select").remove();
        $("#output br").remove();
    }
    if ($("#output table").length) {
        $("#output table").remove();
    }
    var table = $('<table></table>');
    var th1 = "<tr><th>Info om varulager</th><th>Antal</th></tr>";
    table.append(th1);
    var col1 = $("<td></td>").text("Totalt antal varuartiklar");
    var col2 = $("<td></td>").text(data.length);
    var rad0 = $('<tr></tr>');
    rad0.append(col1);
    rad0.append(col2);
    table.append(rad0);

    for (var x = 0; x < data.genres.length; x++) {
        var col7 = $("<td></td>").text(data.genres[x].Genre);
        var col8 = $("<td></td>").text(data.genres[x].Number);
        var rad = $('<tr></tr>');
        rad.append(col7);
        rad.append(col8);
        table.append(rad);
    }
    var modal = document.getElementById('output');
    $("#output").append(table);
    modal.style.display = "block";
}

/* Tabell med allmänn info om anställda; */
function createTable(data)
{
    if ($("#output select").length) {
        $("#output select").remove();
        $("#output br").remove();
    }
    if ($("#output table").length) {
        $("#output table").remove();
    }
    var table = $('<table></table>');
    var th1 = "<tr><th>Info om anställda</th><th>Antal</th></tr>";
    table.append(th1);
    var col1 = $("<td></td>").text("Totalt antal anställda");
    var col2 = $("<td></td>").text(data.length);
    var col3 = $("<td></td>").text("Första anställnings-ID");
    var col4 = $("<td></td>").text(data.minid);
    var col5 = $("<td></td>").text("Sista anställnings-ID");
    var col6 = $("<td></td>").text(data.maxid);
    var rad0 = $('<tr></tr>');
    var rad1 = $('<tr></tr>');
    var rad2 = $('<tr></tr>');
    rad0.append(col1);
    rad0.append(col2);
    rad1.append(col3);
    rad1.append(col4);
    rad2.append(col5);
    rad2.append(col6);
    table.append(rad0);
    table.append(rad1);
    table.append(rad2);

    for (var x = 0; x < data.depars.length; x++) {
        var col7 = $("<td></td>").text(data.depars[x].Department);
        var col8 = $("<td></td>").text(data.depars[x].Number);
        var rad = $('<tr></tr>');
        rad.append(col7);
        rad.append(col8);
        table.append(rad);
    }
    var modal = document.getElementById('output');
    $("#output").append(table);
    modal.style.display = "block";
}

/* ADMIN-session;  */
function setAdmin(obj)
{
    admin = obj;
    var admobj = JSON.parse(admin);
    urls = [];
    urls[0] = "/staff/" + admobj.password;
    urls[1] = "/users/" + admobj.password;
    urls[2] = "/media/" + admobj.password;
    urls[3] = "/contact/" + admobj.password;
    for (var i = 0; i < urls.length; i++)
    {
        sendHead(urls[i]);
    }
    getAutoList();
    getAutoMediaList();
}

/* Sänder HEAD (SPÄRRADE E-tjänster)  */
function sendHead(URL_address)
{
    $.ajax({
        method: "HEAD",
        url: URL_address,
        success:
                function (response) {
                    if (response !== null && response !== "") {
                        if (response === "OK")
                            cookies = true;
                    } else {
                        window.location = './index.html';
                    }
                }
    });
}

/*  Stänger informationsrutan;  */
function closethis() {
    var modal = document.getElementById('output');
    modal.style.display = "none";
    if ($("#output select").length) {
        $("#output select").remove();
        $("#output br").remove();
    }
}

/*  Stänger informationsrutan;  */
function closeinfo() {
    $("#messages").find("h2").first().remove();
    $("#messages").hide();
    if ($("#output select").length) {
        $("#output select").remove();
        $("#output br").remove();
    }
    /*   var modal = document.getElementById('messages');
     modal.style.display = "none"; */
}

/* Inhämtar alla brev från databasen; 
 * Kunderna kan skicka klagåmål, frågor
 * om leveranser, tackbrev m.m.
 * */
function getMessages() {
    $.ajax({
        method: "GET",
        url: "/contact",
        success:
                function (svar) {
                    if (svar !== null && svar !== "") {
                        displayMessages(svar);
                    } else {
                        return;
                    }
                }
    });
}

/* Visar brev i en tabell; */
function displayMessages(data)
{
    if ($("#messages table").length) {
        $("#messages table").remove();
    }
    var table = $('<table></table>');
    table.attr('id', 'messtable');
    var th1 = "<tr><th>Avsändare</th><th>E-post</th><th>Brev</th><th>Datum</th><th> Delete </th></tr>";
    table.append(th1);
    for (var x = 0; x < data.messages.length; x++) {
        var col1 = $("<td></td>").text(data.messages[x].Sender);
        var col2 = $("<td></td>").text(data.messages[x].Email);
        var col3 = $("<td></td>").text(data.messages[x].Message);
        col3.css("width", "30%");
        var col4 = $("<td></td>").text(data.messages[x].Date);
        var col5 = $("<td></td>").text(" Delete ");
        col5.click({param1: data.messages[x]._id}, deleteMessage);
        col5.css("width", "10%");
        col5.addClass('klickamig centrerat');
        col5.attr('id', 'varna');
        var rad = $('<tr></tr>');
        rad.append(col1);
        rad.append(col2);
        rad.append(col3);
        rad.append(col4);
        rad.append(col5);
        table.append(rad);
    }
    var modal = document.getElementById('messages');
    $("#messages").append(table);
    modal.style.display = "block";
}

function deleteMessage(event)
{
    var yes = window.confirm("Vill Du verkligen RADERA meddelandet?");
    if (yes === false) {
        return;
    } else if (yes === true) {
        var id = event.data.param1;
        if (id === null || id === "")
            return;
        else {
            $.ajax({
                method: "DELETE",
                url: "/contact/" + id,
                dataType: 'text',
                success:
                        function (svar) {
                            if (svar !== null && svar !== "") {
                                $('#notes').html("<b>" + svar + "</b>");
                                getMessages();
                            } else {
                                return;
                            }
                        },
                error: function (error) {
                    reset();
                    $('#notes').html("<b>" + error + "</b>");
                }
            });
        }
    }
}

function displayDefault()
{
    var x = document.getElementById("nyaudio");
    x.play();
    alert("UNDER CONSTRUCTION");
}

function showInfo()
{
    var x = document.getElementById("nyaudio");
    x.play();
    alert(" För att ändra LÖN och AVDELNING \n skriv medarbetares namn i sökrutan");
}

function showMedInfo()
{
    var x = document.getElementById("nyaudio");
    x.play();
    alert(" För att ändra PRIS och LAGERANTAL \n skriv de sökta medias titel i sökrutan");
}

function displayInfo(message)
{
    var x = document.getElementById("nyaudio");
    x.play();
    alert(message);
}

// Visar hel ordlista som AUTOCOMPLETE;
function show_choice(resultlist) {
    $("#newtaggs").focus().autocomplete({
        autoFocus: true,
        minLength: 2,
        source: resultlist,
        select: function (event, ui) {
            $(this).val(ui.item.label);
            sendAuto(ui.item.value);
            $(this).val("");
            return false;
        }
    });
}

/* Söker via AUTOCOMPLETE; */
function sendAuto(id) {
    $.ajax({
        method: "GET",
        url: "/staff/" + id,
        success:
                function (svar) {
                    if (svar !== null && svar !== "") {
                        displayWorker(svar);
                    } else {
                        return;
                    }
                }
    });
}

/* Visar en anställd; */
function displayWorker(employee)
{
    var h2 = $("<h2></h2>").html("Röda fält kan redigeras");
    if ($("#messages table").length) {
        $("#messages table").remove();
    }
    var table = $('<table></table>');
    table.attr('id', 'messtable');
    var th1 = "<tr><th>Namn</th><th>E-post</th><th>Telefon</th><th>Avdelning</th><th>Lön i SEK</th></tr>";
    table.append(th1);
    var name = employee.First_name + " " + employee.Last_name;
    var col1 = $("<td></td>").text(name);
    var col2 = $("<td></td>").text(employee.Email);
    var col3 = $("<td></td>").text(employee.Phone);
    col3.css("width", "15%");
    var selcol = $("<select id='depar' name='depar'></select>");
    var counter = -1;
    departments.forEach((row) => {
        counter++;
        var opitem;
        var index = getSelected(employee.Department);
        if (counter === index)
        {
            opitem = $("<option></option>").attr("value", row.value).prop('selected', true).text(row.value);
        } else
        {
            opitem = $("<option></option>").attr("value", row.value).text(row.value);
        }
        selcol.append(opitem);
    });
    selcol.change({param1: employee.ID}, ReadDepart);
    var col4 = $("<td></td>").append(selcol);
    col4.attr('id', 'depar');
    col4.css("width", "15%");
    var input1 = $("<Input type=text id='salary' name='salary' class='input'>");
    input1.val(employee.Salary);
    input1.keydown({param1: employee.ID}, ReadNewSalary);
    var col5 = $("<td></td>").append(input1);
    col5.css("width", "6%");
    col5.addClass('centrerat');
    var rad = $('<tr></tr>');
    rad.append(col1);
    rad.append(col2);
    rad.append(col3);
    rad.append(col4);
    rad.append(col5);
    table.append(rad);
    var modal = document.getElementById('messages');
    $("#messages").append(h2);
    $("#messages").append(table);
    modal.style.display = "block";
}

function ReadDepart(event)
{
    var valueSelected = this.value;
    var data = {"ID": event.data.param1, "dep": valueSelected};

    $.ajax({
        url: '/staff/dep',
        type: 'PUT',
        data: data,
        success: function (result) {
            reset();
            displayWorker(result);
        },
        error: function (error) {
            reset();
            $('#notes').html("<b>" + error + "</b>");
        }
    });
}

function ReadNewSalary(event)
{
    if (event.which === 13 || event.keyCode === 13) {
        var salary = $("#salary").val();
        if (isNaN(salary))
        {
            alert("ENDAST SIFFROR!!!");
            return;
        } else {
            var data = {"ID": event.data.param1, "salary": salary};

            $.ajax({
                url: '/staff/salary',
                type: 'PUT',
                data: data,
                success: function (result) {
                    reset();
                    displayWorker(result);
                },
                error: function (error) {
                    reset();
                    $('#notes').html("<b>" + error + "</b>");
                }
            });
        }
    }
}

function getSelected(vald)
{
    var index = 0;
    departments.forEach((row) => {
        if (vald === row.value)
        {
            index = row.key;
        }
    });
    return index;
}

function reset() {
    $("#messages").find("h2").first().remove();
    $('#notes').html("");
}

function displayByType()
{
    if ($("#output select").length) {
        $("#output select").remove();
        $("#output br").remove();
    }
    if ($("#output table").length) {
        $("#output table").remove();
    }
    var selcol = $("<select id='slag' name='slag'></select>");
    var opitem;
    slag.forEach((row) => {
        if (row.key === 5)
        {
            opitem = $("<option></option>").attr("value", row.key).prop('selected', true).text(row.value);
        } else
        {
            opitem = $("<option></option>").attr("value", row.key).text(row.value);
        }
        selcol.append(opitem);
    });
    selcol.change(getMedia);
    var modal = document.getElementById('output');
    $("#output").append(selcol).append("<br/><br/>");
    modal.style.display = "block";
}

function getMedia()
{
    var valueSelected = this.value;

    if (valueSelected == 5)
    {
        displayInfo("Detta val är inte sökbart");
        return;
    } else
    {
        $.ajax({
            url: '/media/slag/' + valueSelected,
            type: 'GET',
            success: function (result) {
                reset();
                PrintTable(result);
            },
            error: function (error) {
                reset();
                $('#notes').html("<b>" + "Ett fel har inträffat" + "</b>");
            }
        });
    }
}

function PrintTable(data)
{
    if ($("#output table").length) {
        $("#output table").remove();
    }
    var table = $('<table></table>');
    var th0 = $("<th></th>").text(data[0].slag);
    var th1 = "<th>Antal</th>";
    var thrad = $("<tr></tr").append(th0);
    thrad.append(th1);
    table.append(thrad);
    var col1 = $("<td></td>").text("Totalt antal varutitlar");
    var col2 = $("<td></td>").text(data[0].length);
    var rad0 = $('<tr></tr>');
    rad0.append(col1);
    rad0.append(col2);
    table.append(rad0);
    var col7;
    for (var x = 0; x < data[0].poster.length; x++) {
        if (x === 0)
        {
            col7 = $("<td></td>").html("<b>" + data[0].poster[x].Genre + "</b>" + ", varav:");
        } else
        {
            col7 = $("<td></td>").text(data[0].poster[x].Genre);
        }
        var col8 = $("<td></td>").text(data[0].poster[x].Number);
        var rad = $('<tr></tr>');
        rad.append(col7);
        rad.append(col8);
        table.append(rad);
    }
    $("#output").append(table);
}