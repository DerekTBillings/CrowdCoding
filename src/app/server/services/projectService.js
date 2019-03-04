const express = require('express');
const router = express.Router();
const ProjectDao = require('../dao/ProjectDao');
const dao = new ProjectDao();

router.get('/', (req, res) => {
  let session = req.session;
  let rowStart = req.query.rowStart;
  let rowEnd = req.query.rowEnd;

  let userId = (!session) ? -1 : session.userId;
  userId = (userId == undefined) ? -1 : userId;

  rowStart = (rowStart) ? +rowStart : 0;
  rowEnd = (rowEnd) ? +rowEnd : 50;

  dao.getProjects(userId, rowStart, rowEnd, (errors, data) => {
    res.send({projects: data});
    console.log(errors);
    console.log(data);
  });
});



router.get('/getProjectCount', (req, res) => {
  dao.getProjectCount((errors, data) => {
    res.send({projectCount: data.projectCount});
  });
});

router.post('/', (req, res) => {
  let session = req.session;
  let projectId = req.body.projectId;

  if (session == undefined || session.userId == undefined || projectId == undefined) {
    res.send({success: false});
  } else {
    let userId = session.userId;
    let projectId = req.projectId;

    dao.apply(userId, (errors, data) => {
      if (!errors) {
        res.send({success: true});
      } else {
        res.send({success: false});
      }
    });
  }
});

module.exports = router;

