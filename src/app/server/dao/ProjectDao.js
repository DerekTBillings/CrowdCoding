var BaseDao = require('../dao/BaseDao');
var ProjectSql = require('../sql/ProjectSql');

class RegistrationDao {

  constructor() {
    this._baseDao = new BaseDao();
  }

  getProjects(userId, rowStart, rowEnd, callback) {
    const params = [userId, rowStart, rowEnd];

    this._baseDao.query(ProjectSql.getProjects, callback, params);
  }

  getProjectCount(callback) {
    this._baseDao.query(ProjectSql.getProjectCount, callback);
  }

  apply(userId, projectId, callback) {
    const params = [userId, projectId];

    this._baseDao.query(ProjectSql.apply, callback, params);
  }

  addProject(projectDetails, callback) {
    const projectParams = this._toDetailsArray(projectDetails);

    this._baseDao.query(ProjectSql.addProject, (errors, data) => {
      if (!errors) {
        this._baseDao.query(ProjectSql.getProjectId, (errors, data) => {
          const projectId = data[0].project_id;
          console.log('ProjectId = ' + projectId);

          let tools = projectDetails.tools;
          let needs = projectDetails.needs;

          const toolsQuery = this._buildQuery(ProjectSql.addTools, tools.length);
          const toolsParams = this._buildParams(projectId, tools);

          const needsQuery = this._buildQuery(ProjectSql.addNeeds, needs.length);
          const needsParams = this._buildParams(projectId, tools);

          if (tools.length > 0) {
            this._baseDao.query(toolsQuery, (errors, data) => {}, toolsParams);
          }

          if (needs.length > 0) {
            this._baseDao.query(needsQuery, (errors, data) => {}, needsParams);
          }

          this.apply(projectDetails.userId, projectId, (errors, data) => {});

          callback(null, null);
        }, [projectDetails.name, projectDetails.purpose]);
      } else {
        callback(errors, null);
      }
    }, [projectDetails.name, projectDetails.purpose, projectDetails.website]);
  }

  _buildQuery(query, paramCount) {
    for (let i=0; i<paramCount; i++) {
      if (i > 0) {
        query += ', ';
      }

      query += ProjectSql.dynamicParams;
    }
  }

  _buildParams(projectId, params) {
    let mergedParams = [];

    for (let param of params) {
      mergedParams.push(projectId);
      mergedParams.push(param);
    }

    return mergedParams;
  }

  _toDetailsArray(projectDetails) {
    return [
      projectDetails.name,
      projectDetails.purpose,
      projectDetails.website
    ];
  }

}
module.exports = RegistrationDao;
