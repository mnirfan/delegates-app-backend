require('dotenv').config();
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URL)

var index = require('./routes/index');
var users = require('./routes/users');
var events = require('./routes/event.js');
var classes = require('./routes/class.js');
var subs = require('./routes/subscription');
var announcement = require('./routes/announcement');
var auth = require('./middleware/auth')

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/api/static',express.static(path.join(__dirname, 'public',), {maxAge: '1d'}));

app.use('/users', users);
app.use(cors())
app.use('/', index);
app.use(auth)
app.use('/api/event', events)
app.use('/api/class', classes)
app.use('/api/subs', subs)
app.use('/api/announcement', announcement)

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
});

module.exports = app;
