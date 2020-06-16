/* 
 * Databasfil;
 */

const url1 = 'mongodb://localhost/mediadatabas';
const url2 = process.env.MONGODB_URI;
const mongoose = require("mongoose");
mongoose.connect(url2, {useNewUrlParser: true,
    useUnifiedTopology: true, useFindAndModify: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
    console.log("Connected to db");
});

module.exports = mongoose;
