var express = require('express');
var router = express.Router();
const LoginDao = require('../dao/LoginDao');
const encrypt = require('md5');
const dao = new LoginDao();

router.post('/', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (username !== undefined && password !== undefined) {
    password = encrypt(password);

    dao.getUserId(username, password, (errors, data) => {
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

router.get('/status', (req, res) => {
  let isLoggedIn = false;

  if (req.session != undefined && req.session.userId != undefined) {
    isLoggedIn = true;
  }

  res.send({loggedIn: isLoggedIn});
});

module.exports = router;

