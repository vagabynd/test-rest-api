var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var config = require('./libs/config');
var passport = require('passport');
var methodOverride = require('method-override');



var app = express();
var expressWs = require('express-ws')(app);
var ws = require('./libs/websocket/ws');
var libs = process.cwd() + '/libs/';
require(libs + 'auth/auth');
require(libs + 'auth/vk');



var index = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var log = require('./libs/log/log')(module);
var db = require('./libs/db/db-mongdb');
var oauth2 = require('./libs/auth/oauth2');
var oauth = require('./routes/oauth');
var vk = require('./routes/vk');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride());
app.use(passport.initialize());
app.use(passport.session());


app.use('/', index);
app.use('/users', users);
app.use('/api', api);
app.use('/api/oauth', oauth);
app.use('/auth/vkontakte', vk);
app.use('/ws', ws.router);
app.listen(config.get('ws_port'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});



// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
    next(err);
});

module.exports = app;
