/* 
 * Lista med länder;
 */
var express = require('express');
var router = express.Router();

const countries = [
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bangladesh",
    "Belarus",
    "Belgium",
    "Bolivia",
    "Bosnia",
    "Bulgaria",
    "Cambodia",
    "Canada",
    "Czech Republic",
    "Chile",
    "China",
    "Colombia",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Denmark",
    "Ecuador",
    "Estonia",
    "Finland",
    "France",
    "Georgia",
    "Germany",
    "Great Britain",
    "Greece",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Ireland",
    "Israel",
    "Italy",
    "Japan",
    "Kazakhstan",
    "Kyrgyzstan",
    "Latvia",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Malaysia",
    "Malta",
    "Mexico",
    "Moldova",
    "Mongolia",
    "Netherlands",
    "New Zealand",
    "Nicaragua",
    "Nigeria",
    "Norway",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Romania",
    "Russia",
    "Saudi Arabia",
    "Serbia",
    "Singapore",
    "Slovakia",
    "Slovenia",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sverige",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Uganda",
    "Ukraine",
    "USA",
    "Uruguay",
    "Uzbekistan",
    "Venezuela",
    "Vietnam",
    "Yemen"
];

router.get('/', function (req, res, next) {
    res.json(countries);
});

module.exports = router;