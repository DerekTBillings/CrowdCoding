var BaseDao = require('../dao/BaseDao');
var ProjectSql = require('../sql/ProjectSql');

class RegistrationDao {

  constructor() {
    this._baseDao = new BaseDao();
  }

  getProjects(queryParams, callback) {
    const userId = queryParams.userId;
    const filterByUser = queryParams.filterByUser;
    const rowStart = queryParams.rowStart;
    const rowEnd = queryParams.rowEnd;

    let params = [userId, rowStart, rowEnd];
    let query = this.getProjectQuery(filterByUser);

    this._baseDao.query(query, callback, params);
  }

  getProjectQuery(filterByUser) {
    if (filterByUser == 'true' || filterByUser == true) {
      return ProjectSql.getFilteredProjects;
    } else {
      return ProjectSql.getProjects;
    }
  }

  getProjectCount(callback) {
    this._baseDao.query(ProjectSql.getProjectCount, callback);
  }

  apply(userId, projectId, callback) {
    const params = [userId, projectId];

    this._baseDao.query(ProjectSql.apply, callback, params);
  }

  addProject(projectDetails, callback) {
    const projectParams = RegistrationDao._toDetailsArray(projectDetails);

    this._baseDao.query(ProjectSql.addProject, (errors, data) => {
      if (!errors) {
        this._addProjectDependencies(projectDetails, callback);
      } else {
        callback(errors, null);
      }
    }, projectParams);
  }

  _addProjectDependencies(projectDetails, callback) {
    this._baseDao.query(ProjectSql.getProjectId, (errors, data) => {
      const projectId = data[0].project_id;

      this._addProjectDependency(projectId, ProjectSql.addTools, projectDetails.tools);
      this._addProjectDependency(projectId, ProjectSql.addNeeds, projectDetails.needs);

      this.apply(projectDetails.userId, projectId, this._emptyCallback());

      callback(null, null);
    }, [projectDetails.name, projectDetails.purpose]);
  }

  _addProjectDependency(projectId, sql, params) {
    const builtQuery = this._buildQuery(sql, params.length);
    const listedParams = this._buildParams(projectId, params);

    if (tools.length > 0) {
      this._baseDao.query(builtQuery, this._emptyCallback(), listedParams);
    }
  }

  static _buildQuery(query, paramCount) {
    for (let i=0; i<paramCount; i++) {
      if (i > 0) {
        query += ', ';
      }

      query += ProjectSql.dynamicParams;
    }

    return query;
  }

  static _buildParams(projectId, params) {
    let mergedParams = [];

    for (let param of params) {
      mergedParams.push(projectId);
      mergedParams.push(param);
    }

    return mergedParams;
  }

  _emptyCallback() {
    return (errors, data) => {};
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
