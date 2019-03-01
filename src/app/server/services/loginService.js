const express = require('express');
const server = express();
const LoginDao = require('../dao/LoginDao');
const bodyParser = require('body-parser');
const encrypt = require('md5');
const session = require('express-session');
const uuid = require('uuid/v4');
const port = process.env.PORT || 3000;
var path = require('path');


server.use('/js', express.static(__dirname + '/js'));
server.use('/dist', express.static(__dirname + '/../dist'));
server.use('/css', express.static(__dirname + '/css'));
server.use('/partials', express.static(__dirname + '/partials'));

server.all('/', function(req, res, next) {
  console.log('dir: '+__dirname);
  console.log('path.dirname: '+path.dirname(__dirname));
  // Just send the index.html for other files to support HTML5Mode
  // res.sendFile('index.html', {root: __dirname });
  //res.sendFile('index1.html', { root: path.join(__dirname, '../') });
  // res.sendFile('public/index1.html' , { root : __dirname});
  // res.sendFile(__dirname + '../../../index1.html');
  //res.sendfile('/src/index.html');
  res.sendFile('index.html', { root: path.join(__dirname, '../../../') });
  //res.sendFile('index.html', {root: path.dirname(__dirname)});
  //res.sendFile(path.resolve('~/src/index.html'));
});

server.use(bodyParser.urlencoded({ extended: true }));
server.use(bodyParser.json());
server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
server.use(session({
  genid: function(req) {return uuid()},
  secret: 'applesauce',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: true,
    maxAge: 60000
  }
}));
//server.set('trust proxy', 1);
//server.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.post('/services/login', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username !== undefined && password !== undefined) {
    password = encrypt(password);
    getDao().getUserId(username, password, (errors, data) => {
      let loggedIn = false;
      if (!errors && data.length > 0) {
        req.session.userId = data[0]['user_id'];
        loggedIn = true;
      }
      res.send({success: loggedIn});
    });
  } else {
    res.send({success: false});
  }
});

server.get('/services/query', (req, res) => {
  console.log('begin');
  let dao = getDao();
  let users = dao.getUsers((err, data) => {
    console.log('errors:');
    console.log(err);
    console.log('data');
    console.log(data);
    res.send('done');
  });
});

// server.get('*', function(req, res) {
//   // ./server/views/index.html
//   // ./src/index.html
//   //res.sendFile('./src/');
//
//   //if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
//   //  res.sendFile(path.resolve(`~/public/${req.url}`));
//   //} else {
//   console.log('res::');
//   console.log(res);
//   console.log('res::');
//     res.sendFile('src/index.html');
//   //}
// })

function getDao() {
  if (this.dao === undefined) {
    this.dao = new LoginDao();
  }

  return this.dao;
}

