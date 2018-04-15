var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var sessionstore = require('sessionstore');

var app = express();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/www/images/logo.png'));
app.use(logger('dev'));
app.use(bodyParser.json({limit:"1000kb"}));
app.use(bodyParser.urlencoded({limit:"1000kb",extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'www')));

//var aDay = 3600000 * 24;
//app.use(session({
//    secret: '12345',
//    cookie: {maxAge: aDay, expires: new Date(Date.now() + aDay)},
//    store: sessionstore.createSessionStore(),
//    resave: false,
//    saveUninitialized: false
//}));





module.exports = app;
