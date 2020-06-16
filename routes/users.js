/* KUNDER; */
const mongoose = require("./mongoose");
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({extended: true}));
router.use(bodyParser.json());
var cookieParser = require('cookie-parser');
router.use(cookieParser());
var adminsession = null;
var person = "";
var idnumber = "";
var email = "";
var land = "";

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

// Skapa ett db-schema User
var userSchema = mongoose.Schema({
    _id: {type: mongoose.Schema.Types.ObjectId, required: true, auto: true},
    Category: String,
    Company: String,
    Person: String,
    Email: String,
    Country: String,
    Username: String,
    Password: String
});

// Skapa en model Staff
User = mongoose.model('User', userSchema);

/* GET all users listing; */
router.get('/', function (req, res, next) {
    if (adminsession === null)
        return res.redirect("../../index.html");
    else {
        res.contentType('application/json');
        User.find(function (err, users) {
            if (err) {
                return next(err);
            }
            res.json({"users": users});
        });
    }
});

/* KUNDENS egen sida; */
router.get('/ownpage', function (req, res, next) {
    if (req.cookies['mediabutik'] === null)
        return res.redirect("../../index.html");
    if (req.cookies['mediabutik'] !== null)
    {
        res.render('ownpage', {title: "Din sida", personname: person, epost: email, country: land, id: idnumber}, function (err, html) {
            if (err)
                res.render('error', {message: "ERROR!"});
            else
                res.send(html);
        });
    }
 }
);

/* Registrerar en ny kund;  */
router.post('/', (req, res) => {
    const type = req.body.type;
    const company = req.body.firm;
    const name = req.body.name;
    const email = req.body.email;
    const country = req.body.country;
    var preffix = "fi"; // Firmakund;
    if (type === "private")
        preffix = "pr";  // Privat kund;

    const {v4: uuidv4} = require('uuid');
    var uuid1 = uuidv4();
    var del = uuid1.substring(0, 8);
    var username = preffix.concat(del);
    var uuid = uuidv4();
    var password = uuid.substring(0, 10);

    var user = new User({
        Category: type,
        Company: company,
        Person: name,
        Email: email,
        Country: country,
        Username: username,
        Password: password
    });
    // Spara till databasen
    user.save(function (err) {
        if (err)
            return res.send("ERROR");
    });
    var answer = "  Ditt username: " + username + ", " + "Ditt lösenord: " + password;
    res.status(200).send("OK:" + answer);
});

router.post('/login', (req, res) => {
    var user_name = req.body.user;
    var pass = req.body.pass;
    User.findOne({$and: [{Username: user_name}, {Password: pass}]
    }, function (err, thisuser) {
        if (err)
            return done(err);
        if (thisuser === null)
        {
            return res.status(307).render('error', {message: "Fel inloggning!"});
        } else {
            person = thisuser.Person;
            email = thisuser.Email;
            idnumber = thisuser._id;
            land = thisuser.Country;
            let user = {
                user_id: user_name,
                password: pass
            };
            res.cookie("mediabutik", user, {maxAge: 360000});
            return res.status(200).end();
        }
    });
});

/*********************************************
 * Delete unique Customer with ID: Varje
 * kund har ett unikt ID, som skickas till 
 * servern och kunden raderas då i databasen
 *********************************************/
router.delete('/:id', function (req, res, next) {
    if (adminsession === null)
        return res.redirect("../../index.html");
    else
    {
        var delid = req.params.id;
        User.findByIdAndRemove(delid, {useFindAndModify: false}, (err, obj) => {
            // FEL
            if (err)
                return res.status(500).send(err);
            return res.status(200).send("Kunden har raderats");
        });
    }
});

module.exports = router;
