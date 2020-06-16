/* 
 * Databasfil;
 */

const url1 = 'mongodb://localhost/mediadatabas';
const url2 = 'mongodb+srv://new-user_2020:sjd843h_z8dukh@cluster0-ytjbf.mongodb.net/mediadatabas?retryWrites=true&w=majority';
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