const express = require('express');
const router = express.Router();
const encrypt = require('md5');
const RegistrationDao = require('../dao/RegistrationDao');
const dao = new RegistrationDao();

router.get('/', (req, res) => {
  let username = req.query.username;

  if (username !== undefined) {
    dao.isUsernameUnique(username, (errors, data) => {
      let isUnique = false;

      if (!errors) {
        isUnique = +data[0]['count'] == 0;
      }

      res.send({isUnique: isUnique});
    });
  } else {
    res.send({isUnique: false});
  }
});

router.post('/', (req, res) => {
  let params = req.body;

  let isValid = validate(params);

  if (isValid) {
    params.password = encrypt(params.password);
    dao.register(params, (errors, data) => {
      if (!errors) {
        res.send({success: true});
      } else {
        res.send({success: false});
      }
    });
  } else {
    res.send({success: false});
  }
});

function validate(params) {
  return (
    hasValue(params.firstName) &&
    hasValue(params.lastName) &&
    hasValue(params.email) &&
    hasValue(params.phoneNumber) &&
    hasValue(params.username) &&
    hasValue(params.password)
  );
}

function hasValue(value) {
  return (value && value.length > 0);
}

module.exports = router;

