var express = require('express');
var router = express.Router();

router.get('/', (req, res) => {
  let session = req.session;

  if (session != undefined) {
    delete session['userId'];
  }

  res.send({success: true});
});

module.exports = router;

