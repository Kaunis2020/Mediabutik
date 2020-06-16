/* 
 * Userpage;
 */
var cookie = false;

$(document).ready(function () {
    var thiscookie = decodeURIComponent(document.cookie);
    if (thiscookie.startsWith("mediabutik"))
        cookie = true;
    else
    {
        window.location = './index.html';
    }
    $("#submit").click(function () {
        EnableDisable();
        submitLetter();
    });
});

function submitLetter()
{
    var name = $("#yourname").val();
    var epost = $("#email").val();
    var land = $("#country").val();
    var subj = $("#subject").val();
    var mess = $("#message").val();

    if (subj === null || subj === "" || mess === null || mess === "")
    {
        $("#submit").prop("disabled", true);
        return;
    } else
    {
        var data = {"name": name,
            "email": epost,
            "country": land,
            "subject": subj,
            "message": mess
        };
        $.ajax({
            type: "POST",
            url: '/contact',
            data: data,
            success: function (data) {
                reset();
                $('#notes').html("<b>" + data + "</b>");
            },
            error: function (error) {
                reset();
                $('#notes').html("<b>" + error + "</b>");
            }
        });
    }
}

function reset()
{
    $("#subject").val("");
    $("#message").val("");
}

function EnableDisable()
{
    var subj = $("#subject").val();
    var mess = $("#message").val();
    if (subj === null || subj === "" || mess === null || mess === "")
    {
        $("#submit").prop("disabled", true);
    } else {
        $("#submit").prop("disabled", false);
    }
}