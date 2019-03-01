var express = require('express');
var router = express.Router();
const LoginDao = require('../dao/LoginDao');
const encrypt = require('md5');

router.post('/', (req, res) => {
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

router.get('/query', (req, res) => {
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

function getDao() {
  if (this.dao === undefined) {
    this.dao = new LoginDao();
  }

  return this.dao;
}

module.exports = router;

