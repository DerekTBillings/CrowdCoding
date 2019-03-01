var BaseDao = require('../dao/BaseDao');
var LoginSql = require('../sql/LoginSql');

class LoginDao {

  constructor() {
    this._baseDao = new BaseDao();
  }

  getUserId(username, password, callback) {
    let params = [username, password];

    this._baseDao.query(LoginSql.getUserId, callback, params);
  }

  getUsers(callback) {
    this._baseDao.query(LoginSql.getAllUsersSql, callback);
  }

}
module.exports = LoginDao;
