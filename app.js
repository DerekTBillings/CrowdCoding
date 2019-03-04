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
const app = express();
const session = require('express-session');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({'extended':'false'}));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(session({
  genid: function(req) {return uuid()},
  secret: 'applesauce',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 60000
  }
}));

app.use('/services/login', loginService);
app.use('/services/registration', registrationService);
app.use('/services/project', projectService);

app.get('*', function (req, res) {
  res.sendfile('./dist/index.html');
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
