const express = require('express');
const router = express.Router();
const ProjectDao = require('../dao/ProjectDao');
const dao = new ProjectDao();

router.get('/', (req, res) => {
  const queryParams = prepareProjectQueryParams(req);

  dao.getProjects(queryParams, (errors, data) => {
    data.forEach(row => {
      row.tools = cleanupArray(row.tools);
      row.needs = cleanupArray(row.needs);
      row.applied = (row.applied == 0) ? false : true;
    });

    res.send({projects: data});
  });
});

function prepareProjectQueryParams(req) {
  let session = req.session;
  let userId = (!session) ? -1 : session.userId;
  userId = (userId == undefined) ? -1 : userId;

  let rowStart = req.query.rowStart;
  let rowEnd = req.query.rowEnd;
  rowStart = (rowStart) ? +rowStart : 0;
  rowEnd = (rowEnd) ? +rowEnd : 5;

  //filter by a sql wildcard. A sql wildcard will effectively remove the filter
  let filterByUser = req.query.filterByUser;

  return {
    userId: userId,
    rowStart: rowStart,
    rowEnd: rowEnd,
    filterByUser: filterByUser
  };
}

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

router.get('/getUserProjectCount', (req, res) => {
  let session = req.session;
  let userId = (!session) ? -1 : session.userId;
  userId = (userId == undefined) ? -1 : userId;

  dao.getUserProjectCount(userId, (errors, data) => {
    res.send({projectCount: data[0]['count']});
  });
});

router.post('/apply', (req, res) => {
  let session = req.session;
  let projectId = req.body.projectId;

  if (!isSignedIn(session) || projectId == undefined) {
    sendSuccessStatus(res, false);
  } else {
    let userId = session.userId;

    dao.apply(userId, projectId, (errors, data) => {
      if (!errors) {
        sendSuccessStatus(res, true);
      } else {
        sendSuccessStatus(res, false);
      }
    });
  }
});

function isSignedIn(session) {
  return session != undefined && session.userId != undefined;
}

router.post("/", (req, res) => {
  let session = req.session;

  if (!isSignedIn(session)) {
    sendSuccessStatus(res, "User isn't signed in.");
  } else {
    let projectDetails = collectProjectDetails(req);
    let validationError = validate(projectDetails);

    if (hasAValue(validationError)) {
      sendSuccessStatus(res, validationError);
    } else {
      dao.addProject(projectDetails, (errors, data) => {
        if (!errors) {
          sendSuccessStatus(res, true);
        } else {
          sendSuccessStatus(res, false);
        }
      });
    }
  }
});

function collectProjectDetails(req) {
  let params = req.body;

  return {
    name: params.name,
    purpose: params.purpose,
    website: params.website,
    needs: params.needs,
    tools: params.tools,
    userId: req.session.userId
  };
}

function validate(projectDetails) {
  if (!hasAValue(projectDetails.name)) {
    return 'A project name is required.';
  } else if (!hasAValue(projectDetails.purpose)) {
    return 'A project name is required.';
  } else {
    return '';
  }
}

function hasAValue(str) {
  return str !== undefined && str !== '';
}

function sendSuccessStatus(res, success, message) {
  res.send({success: success, message: message});
}

module.exports = router;

