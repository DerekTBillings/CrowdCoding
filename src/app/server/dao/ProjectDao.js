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

}
module.exports = RegistrationDao;
