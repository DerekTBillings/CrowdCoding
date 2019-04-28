const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('express').Router();
const uuid = require('uuid/v4');

const loginService = require('./src/app/server/services/loginService');
const registrationService = require('./src/app/server/services/registrationService');
const projectService = require('./src/app/server/services/projectService');
const logoutService = require('./src/app/server/services/logoutService');

const app = express();
const cookieParser = require('cookie-parser');
const cookieSession = require('cookie-session');
var Keygrip = require('keygrip');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'www')));

app.use(cookieSession({
  name: 'session',
  keys: new Keygrip(['key1', 'key2'], 'SHA384', 'base64'),
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

app.use(cookieParser());
app.use('/services/login', loginService);
app.use('/services/registration', registrationService);
app.use('/services/project', projectService);
app.use('/services/logout', logoutService);

app.get('*', function (req, res) {
  res.sendFile(__dirname + '/www/index.html');
});

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
