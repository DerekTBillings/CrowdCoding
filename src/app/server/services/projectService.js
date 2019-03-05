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
    data.forEach(row => {
      row.tools = cleanupArray(row.tools);
      row.needs = cleanupArray(row.needs);
      row.applied = (row.applied == 0) ? false : true;
    });

    res.send({projects: data});
  });
});

function cleanupArray(str) {
  if (str == undefined || str == '' || str == 'NULL') {
    return [];
  }

  str = str.replace(/['"]/g, '');
  return str.split(',');
}

router.get('/getProjectCount', (req, res) => {
  dao.getProjectCount((errors, data) => {
    res.send({projectCount: data[0]['count']});
  });
});

router.post('/apply', (req, res) => {
  let session = req.session;
  let projectId = req.body.projectId;

  if (session == undefined || session.userId == undefined || projectId == undefined) {
    res.send({success: false});
  } else {
    let userId = session.userId;

    dao.apply(userId, projectId, (errors, data) => {
      if (!errors) {
        res.send({success: true});
      } else {
        res.send({success: false});
      }
    });
  }
});

module.exports = router;

