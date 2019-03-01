var mysql = require('mysql');

class BaseDao {

  constructor() {
    this._connPool = mysql.createPool({
      host: 'aaxmoykutsr73w.cj7tspguovjr.us-east-1.rds.amazonaws.com',
      user: 'derek',
      password: 'password',
      port: '3306',
      database: 'codeforgood',
      connectionLimit: 10
    });
  }

  query(rawSql, callback, params) {
    if (params === undefined) params = [];

    let sql = mysql.format(rawSql, params);

    this._connPool.getConnection(function(err, conn) {
      if (err) {
        console.log(err);
      } else {
        conn.query(sql, function(err, result) {
          conn.release();

          if (err) {
            callback(err, null);
          } else {
            callback(null, result);
          }
        });
      }
    });
  }

}
module.exports = BaseDao;
