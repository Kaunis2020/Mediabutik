/* 
 * Brev till mediabutik: frågor, klagomål mm.
 * Alla brev sparas i databasen och visas för ADMIN;
 * ADMIN kan läsa och besvara alla brev och radera;
 */
const mongoose = require("./mongoose");
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
var adminsession = null;

/*********************************************
 * Funktionen får in administratörens lösenord;
 * Webbtjänster som gäller bearbetning av data
 * är spärrade och är tillgängliga endast för
 * mediabutikens administratör (inloggning krävs);
 *********************************************/
router.head('/:object', function (req, res, next)
{
    var obj = req.params.object;
    adminsession = obj;
    if (adminsession !== null && adminsession !== "")
    {
        return res.status(200).send("OK");
    } else
    {
        adminsession = null;
        return res.send("FORBIDDEN");
    }
});

// Skapa ett db-schema Meddelanden
var kontaktSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true, auto: true},
    Sender: String,
    Email: String,
    Country: String,
    Subject: String,
    Message: String,
    Date: String
});
// Skapa en model Media
Kontakt = mongoose.model('Kontakt', kontaktSchema);

router.get('/', function (req, res, next) {
    res.contentType('application/json');

    Kontakt.find(function (err, messages) {
        if (err) {
            return next(err);
        }
        res.json({"messages": messages});
    });
});

router.post('/', (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const country = req.body.country;
    const subject = req.body.subject;
    const mess = req.body.message;
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    today = yyyy + '-' + mm + '-' + dd;

    var kont = new Kontakt({
        Sender: name,
        Email: email,
        Country: country,
        Subject: subject,
        Message: mess,
        Date: today
    });
    // Spara till databasen
    kont.save(function (err) {
        if (err)
            return res.send("ERROR");
    });
    res.status(200).send("OK -- Tack för Ditt brev");
});

/*********************************************
 * Delete unique contact id
 *********************************************/
router.delete('/:id', function (req, res, next) {
    if (adminsession === null)
        return res.redirect("../../index.html");
    else
    {
        var delid = req.params.id;
        Kontakt.findByIdAndRemove(delid, {useFindAndModify: false}, (err, obj) => {
            // FEL
            if (err)
                return res.status(500).send(err);
            return res.status(200).send("Brevet har raderats");
        });
    }
});

module.exports = router;