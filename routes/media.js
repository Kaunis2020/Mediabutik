/* 
 * Media: filmer (DVD), böcker, cd-skivor;
 * Denna del är endast för läsning/visning och uppdatering. 
 * Skall INTE raderas. Detta är mediabutikens utbud av media.
 */
const slag = ["BOK", "CD", "DVD"];
const mongoose = require("./mongoose");
var express = require('express');
var router = express.Router();
var adminsession = null;
// Array med böcker;
const books = [
    "Barnlitteratur",
    "Biografi",
    "Datateknik, datavetenskap",
    "Drama",
    "Handarbete",
    "Historisk roman",
    "Kost, Matlagning",
    "Lingvistik och språk",
    "Turism",
    "Science fiction",
    "Övrigt"
];

const cds = [
    "Balettmusik",
    "Barnmusik",
    "Chanson",
    "Datorspel",
    "Filmmusik",
    "Folkmusik",
    "Julmusik",
    "Klassisk musik",
    "Ljudbok",
    "Modern musik",
    "Opera",
    "Orkestermusik",
    "Pop, populär musik",
    "Språkkurs",
    "Övrigt"
];

const dvds = [
    "Action",
    "Animerad film",
    "Barnfilm",
    "Biografi",
    "Datorspel",
    "Deckare",
    "Drama",
    "Gangsterfilm",
    "Historisk film",
    "Katastroffilm",
    "Komedi",
    "Musikfilm, musikal",
    "Rysare",
    "Science fiction",
    "Skräckfilm",
    "Thriller",
    "Övrigt"
];

// Array med olika genrer
const medias =
        [
            "Action",
            "Animerad film",
            "Balettmusik",
            "Barnfilm",
            "Barnlitteratur",
            "Biografi",
            "Chanson",
            "Datateknik, datavetenskap",
            "Datorspel",
            "Drama",
            "Filmmusik",
            "Handarbete",
            "Historisk film",
            "Historisk roman",
            "Julmusik",
            "Katastroffilm",
            "Klassisk musik",
            "Kost, Matlagning",
            "Lingvistik och språk",
            "Ljudbok",
            "Modern musik",
            "Musikfilm, musikal",
            "Pop, populär musik",
            "Science fiction",
            "Skräckfilm",
            "Språkkurs",
            "Övrigt"
        ];

// Skapa ett db-schema Media
var mediaSchema = mongoose.Schema({
    _id: Number,
    ID_Nr: String,
    Titel: String,
    Description: String,
    Year: String,
    Creator: String,
    Genre: String,
    ProductionYear: Date,
    HuvudTyp: String,
    Mediatyp: String,
    Pris: Number,
    Lagerantal: Number,
    MediaKategori: Number
});

// Skapa en model Media
Media = mongoose.model('Media', mediaSchema);

/*********************************************
 * Funktionen returnerar info om produkterna;
 *********************************************/
router.get('/all', function (req, res, next) {
    res.contentType('application/json');

    Media.find({}, null, {sort: {'_id': 1}}, function (err, dbmedia) {
        if (err) {
            return next(err);
        }
        var coun = dbmedia.length;
        var deps = [];
        var counter = 0;

        medias.forEach((row) =>
        {
            dbmedia.forEach((dbrow) =>
            {
                if (dbrow.Genre === row)
                {
                    counter++;
                }
            });
            var obj = {"Genre": row, "Number": counter};
            deps.push(obj);
            counter = 0;
        });
        var data = {"length": coun, "genres": deps};
        res.json(data);
    });
});

/*********************************************
 * Get complete media listing for Autocomplete
 *********************************************/
router.get('/list', function (req, res, next) {
    res.contentType('application/json');
    Media.find({}, null, {sort: {'_id': 1}}, function (err, dbstaff) {
        if (err) {
            return next(err);
        }
        const poster = [];

        dbstaff.forEach((dbrow) =>
        {
            var str = dbrow.ID_Nr;
            var idtit = str.concat(' --  ', dbrow.Titel);
            var obj = {"label": idtit, "value": dbrow.ID_Nr};
            poster.push(obj);
        });
        res.json(poster);
    });
});

/*********************************************
 * Get complete media listing
 *********************************************/
router.get('/', function (req, res, next) {
    res.contentType('application/json');

    Media.find({}, null, {sort: {'_id': 1}}, function (err, dbmedia) {
        if (err) {
            return next(err);
        }
        res.json({"dbmedia": dbmedia});
    });
});

/*********************************************
 * Get complete media listing according types
 * MAIN TYPES: BOK, CD, DVD
 *********************************************/
router.get('/:type', function (req, res, next) {
    var typ = req.params.type;
    res.contentType('application/json');
    Media.find({Mediatyp: typ}, null, {sort: {_id: 1}}, function (err, dbmedia) {
        if (err) {
            return next(err);
        }
        res.json({"dbmedia": dbmedia});
    });
});

/*********************************************
 * Get complete media listing according types
 * MAIN TYPES: BOK, CD, DVD
 *********************************************/
router.get('/auto/:type', function (req, res, next) {
    var typ = req.params.type;
    var poster = [];
    res.contentType('application/json');
    Media.distinct("Creator", {Mediatyp: typ}, function (err, posts) {
        if (err)
            return done(err);
        posts.forEach((po) =>
        {
            poster.push(po);
        });
        Media.distinct("Titel", {Mediatyp: typ}, function (err, posts) {
            if (err)
                return done(err);
            posts.forEach((po) =>
            {
                poster.push(po);
            });
            poster.sort();
            return res.json(poster);
        });
    });
});


/*********************************************
 * Get auto search media listing according types
 * MAIN TYPES: BOK, CD, DVD
 *********************************************/
router.get('/auto/:type/search/:sokord', function (req, res, next) {
    var typ = req.params.type;
    var sokord = req.params.sokord;
    res.contentType('application/json');
    Media.find({$or: [
            {$and: [{Mediatyp: typ}, {Titel: sokord}]},
            {$and: [{Mediatyp: typ}, {Creator: sokord}]}
        ]
    }, function (err, dbmedia) {
        if (err)
            return done(err);
        res.json({"dbmedia": dbmedia});
    });
});

/*********************************************
 * Get free search media listing according types
 * MAIN TYPES: BOK, CD, DVD
 *********************************************/
router.get('/free/:type/search/:sokord', function (req, res, next) {
    var typ = req.params.type;
    var sokord = req.params.sokord;
    Media.find({$or: [
            {$and: [{Mediatyp: typ}, {Titel: new RegExp(sokord, "i")}]},
            {$and: [{Mediatyp: typ}, {Creator: new RegExp(sokord, "i")}]},
            {$and: [{Mediatyp: typ}, {Description: new RegExp(sokord, "i")}]}
        ]
    }, function (err, dbmedia) {
        if (err)
            return done(err);
        if (dbmedia.length > 0)
        {
            res.contentType('application/json');
            res.json({"dbmedia": dbmedia});
        } else
            res.send("");
    });
});

/* Inhämtar media (bok, cd, dvd) via UNIKT ID;  */
router.get('/:id', function (req, res, next) {
    var objid = req.params.id;
    Media.findOne({'ID_Nr': objid}, function (err, result) {
        if (err) {
            res.status(500).send(err);
        }
        res.json(result);
    });
});

/*********************************************
 * Funktionen returnerar info om produkterna;
 *********************************************/
router.get('/slag/0', function (req, res, next) {
    res.contentType('application/json');
    var poster = [];
    var medialist = [];
    var counter = 0;
    var counter2 = 0;
    var litt = "Litteratur";
    Media.find({Mediatyp: slag[0]}, null, {sort: {'_id': 1}}, function (err, dbmedia) {
        if (err) {
            return next(err);
        }
        var coun = dbmedia.length;

        dbmedia.forEach((dbrow) =>
        {
            if (dbrow.HuvudTyp === litt)
                counter2++;
        });
        var obj0 = {"Genre": litt, "Number": counter2};
        poster.push(obj0);
        counter2 = 0;
        books.forEach((row) => {
            dbmedia.forEach((dbrow) =>
            {
                if (dbrow.Genre === row)
                {
                    counter++;
                }
            });
            var obj = {"Genre": row, "Number": counter};
            poster.push(obj);
            counter = 0;
        });
        var objelist = {"slag": slag[0], "length": coun, "poster": poster};
        medialist.push(objelist);
        res.json(medialist);
    });
});

/*********************************************
 * Funktionen returnerar info om produkterna;
 *********************************************/
router.get('/slag/1', function (req, res, next) {
    res.contentType('application/json');
    var poster = [];
    var medialist = [];
    var counter = 0;
    var counter2 = 0;
    var counter3 = 0;
    var mus = "Musik";
    var au = "Audio";
    Media.find({Mediatyp: slag[1]}, null, {sort: {'_id': 1}}, function (err, dbmedia) {
        if (err) {
            return next(err);
        }
        var coun = dbmedia.length;

        dbmedia.forEach((dbrow) =>
        {
            if (dbrow.HuvudTyp === mus)
                counter2++;
            if (dbrow.HuvudTyp === au)
                counter3++;
        });
        var obj0 = {"Genre": mus, "Number": counter2};
        poster.push(obj0);
        counter2 = 0;
        var obj1 = {"Genre": au, "Number": counter3};
        poster.push(obj1);
        counter3 = 0;
        cds.forEach((row) => {
            dbmedia.forEach((dbrow) =>
            {
                if (dbrow.Genre === row)
                {
                    counter++;
                }
            });
            var obj = {"Genre": row, "Number": counter};
            poster.push(obj);
            counter = 0;
        });
        var objelist = {"slag": slag[1], "length": coun, "poster": poster};
        medialist.push(objelist);
        res.json(medialist);
    });
});

/*********************************************
 * Funktionen returnerar info om produkterna;
 *********************************************/
router.get('/slag/2', function (req, res, next) {
    res.contentType('application/json');
    var poster = [];
    var medialist = [];
    var counter = 0;
    var counter2 = 0;
    var fm = "Film";
    Media.find({Mediatyp: slag[2]}, null, {sort: {'_id': 1}}, function (err, dbmedia) {
        if (err) {
            return next(err);
        }
        var coun = dbmedia.length;

        dbmedia.forEach((dbrow) =>
        {
            if (dbrow.HuvudTyp === fm)
                counter2++;
        });
        var obj0 = {"Genre": fm, "Number": counter2};
        poster.push(obj0);
        counter2 = 0;
        dvds.forEach((row) => {
            dbmedia.forEach((dbrow) =>
            {
                if (dbrow.Genre === row)
                {
                    counter++;
                }
            });
            var obj = {"Genre": row, "Number": counter};
            poster.push(obj);
            counter = 0;
        });
        var objelist = {"slag": slag[2], "length": coun, "poster": poster};
        medialist.push(objelist);
        res.json(medialist);
    });
});

/* För alla metoder, som gör ändringar i databasen
 * måste ADMIN-SESSION kontrolleras. Endast ADMIN
 * har behörighet att radera, lägga till och
 * uppdatera uppgifter i databasen, t ex radera 
 * kunder, radera brev, stätta nya priser på varor osv. */
router.put('/pris', function (req, res, next) {
    if (adminsession === null)
        return res.redirect("../../index.html");
    else {
        var Id = req.body.ID;
        var price = req.body.price;
        Media.updateOne({"ID_Nr": Id}, {$set: {"Pris": price}}, function (err, result) {
            if (err)
            {
                return next(err);
            }
            Media.findOne({'ID_Nr': Id}, function (err, result) {
                if (err) {
                    res.status(500).send(err);
                }
                res.json(result);
            });
        });
    }
});

router.put('/lager', function (req, res, next) {
    if (adminsession === null)
        return res.redirect("../../index.html");
    else {
        var Id = req.body.ID;
        var lager = req.body.lager;
        Media.updateOne({"ID_Nr": Id}, {$set: {"Lagerantal": lager}}, function (err, result) {
            if (err)
            {
                return next(err);
            }
            Media.findOne({'ID_Nr': Id}, function (err, result) {
                if (err) {
                    res.status(500).send(err);
                }
                res.json(result);
            });
        });
    }
}); 

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

module.exports = router;
