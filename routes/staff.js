/* 
 * Mediabutikens medarbetare;
 */
/// Array med företagets avdelningar;
const departments = [
    "Accounting",
    "Cleaning",
    "Design",
    "Development",
    "Export",
    "Finance",
    "Import",
    "Marketing",
    "Sales",
    "Support"
];

const depars = [
    {"key": 0, "value": "Accounting"},
    {"key": 1, "value": "Cleaning"},
    {"key": 2, "value": "Design"},
    {"key": 3, "value": "Development"},
    {"key": 4, "value": "Export"},
    {"key": 5, "value": "Finance"},
    {"key": 6, "value": "Import"},
    {"key": 7, "value": "Marketing"},
    {"key": 8, "value": "Sales"},
    {"key": 9, "value": "Support"}
];

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

// Skapa ett db-schema Media
var staffSchema = mongoose.Schema({
    _id: Number,
    Nummer: Number,
    ID: String,
    First_name: String,
    Last_name: String,
    Email: String,
    Phone: String,
    Department: String,
    Salary: Number,
    Bild: String
});
// Skapa en model Staff
Staff = mongoose.model('Staff', staffSchema);

router.get('/depart', function (req, res, next) {
    res.contentType('application/json');
    res.json(depars);
});

/*********************************************
 * Get complete employees listing
 *********************************************/
router.get('/list', function (req, res, next) {
    res.contentType('application/json');
    Staff.find({}, null, {sort: {'_id': 1}}, function (err, dbstaff) {
        if (err) {
            return next(err);
        }
        poster = [];

        dbstaff.forEach((dbrow) =>
        {
            var str = dbrow.First_name;
            var tname = str.concat(' ', dbrow.Last_name);
            var obj = {"label": tname, "value": dbrow.ID};
            poster.push(obj);
        });
        res.json(poster);
    });
});

/*********************************************
 * Get complete employees listing
 *********************************************/
router.get('/', function (req, res, next) {
    res.contentType('application/json');
    Staff.find({}, null, {sort: {'_id': 1}}, function (err, dbstaff) {
        if (err) {
            return next(err);
        }
        res.json({"dbstaff": dbstaff});
    });
});

/*********************************************
 * Funktionen returnerar data om anställda:
 * Antal anställda, anställningsnummer samt
 * antal anställda för varje avdelning
 *********************************************/
router.get('/all', function (req, res, next) {
    Staff.find({}, null, {sort: {'_id': 1}}, function (err, dbstaff) {
        if (err) {
            return next(err);
        }
        var coun = dbstaff.length;
        var deps = [];
        var counter = 0;
        departments.forEach((row) =>
        {
            dbstaff.forEach((dbrow) =>
            {
                if (dbrow.Department === row)
                {
                    counter++;
                }
            });
            var obj = {"Department": row, "Number": counter};
            deps.push(obj);
            counter = 0;
        });
        var data = {"length": coun, "minid": dbstaff[0]._id, "maxid": dbstaff[coun - 1]._id, "depars": deps};
        res.contentType('application/json');
        res.json(data);
    });
});

/* Inhämtar en medarbetare via ID;  */
router.get('/:id', function (req, res, next) {
    if (adminsession === null)
        return res.redirect("../../index.html");
    else
    {
        var objid = req.params.id;
        Staff.findOne({'ID': objid}, function (err, result) {
            if (err) {
                res.status(500).send(err);
            }
            res.json(result);
        });
    }
});

router.put('/dep', function (req, res, next) {
    if (adminsession === null)
        return res.redirect("../../index.html");
    else
    {
        var Id = req.body.ID;
        var dep = req.body.dep;
        Staff.updateOne({"ID": Id}, {$set: {"Department": dep}}, function (err, result) {
            if (err)
            {
                return next(err);
            }
            Staff.findOne({'ID': Id}, function (err, result) {
                if (err) {
                    res.status(500).send(err);
                }
                res.json(result);
            });
        });
    }
});

router.put('/salary', function (req, res, next) {
    if (adminsession === null)
        return res.redirect("../../index.html");
    else
    {
        var Id = req.body.ID;
        var salary = req.body.salary;
        Staff.updateOne({"ID": Id}, {$set: {"Salary": salary}}, function (err, result) {
            if (err)
            {
                return next(err);
            }
            Staff.findOne({'ID': Id}, function (err, result) {
                if (err) {
                    res.status(500).send(err);
                }
                res.json(result);
            });
        });
    }
});

module.exports = router;