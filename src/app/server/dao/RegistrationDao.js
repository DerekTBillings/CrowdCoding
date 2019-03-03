var BaseDao = require('../dao/BaseDao');
var RegistrationSql = require('../sql/RegistrationSql');

class RegistrationDao {

  constructor() {
    this._baseDao = new BaseDao();
  }

  isUsernameUnique(username, callback) {
    this._baseDao.query(RegistrationSql.isUsernameUnique, callback, [username]);
  }

  register(rawParams, callback) {
    const params = [
      rawParams.firstName,
      rawParams.lastName,
      rawParams.username,
      rawParams.password,
      rawParams.email,
      rawParams.phoneNumber
    ];

    this._baseDao.query(RegistrationSql.register, callback, params);
  }

}
module.exports = RegistrationDao;
