/* 
 * Larissa Rosenbrant, laro0501;
 * Admin-script, Admin har rätt att se, ändra och radera.
 */
var express = require('express');
var router = express.Router();
var bodyParser=require("body-parser");
var session = require('client-sessions');
var fs = require('fs');
var path = require('path');
var filepath = path.join(__dirname, 'admin.json');
var admobj = JSON.parse(fs.readFileSync(filepath));
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

// a 2 hour encrypted session
router.use(session({
    cookieName: 'Authenticated',
    secret: 'admin',
    duration: 2 * 60 * 60 * 1000,
    cookie: {maxAge: 60000}
}));

router.get('/', authenticate, function (req, res) {
    res.render('adminsida', {title: "Adminsida", admindata: req.Authenticated.user});
});

router.post('/', function (req, res, next) {
    var user_name = req.body.user;
    var pass = req.body.pass;
    if (admobj.username === user_name && admobj.password === pass)
    {
        var admin = {"user": user_name, "password": pass};
        req.Authenticated.user = admin;
        return res.status(200).send();
    }        
    else
    {
        return res.status(307).render('error', {message: "Felaktig inloggning!"});    
    }
});

function authenticate(req, res, next) {
  if (req.Authenticated.user) {
        next();
    } else {
       res.redirect('./index.html');
    }
};

router.use('/', function (err, req, res, next) {
    //User should be authenticated!
    if(!req.Authenticated.user)
        res.redirect('./index.html');
});
module.exports = router;