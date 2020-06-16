var createError = require('http-errors');
var express = require('express');
const bodyParser = require("body-parser");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
var mediaRouter = require('./routes/media');
var staffRouter = require('./routes/staff');
var adminRouter = require('./routes/admin');
var usersRouter = require('./routes/users');
var countyRouter = require('./routes/countries');
var contactRouter = require('./routes/contact');
var indexRouter = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/favicon.ico', express.static('favicon.ico'));
app.use('/media', mediaRouter);
app.use('/staff', staffRouter);
app.use('/admin', adminRouter);
app.use('/countries', countyRouter);
app.use('/users', usersRouter);
app.use('/contact', contactRouter);
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
module.exports = app;
