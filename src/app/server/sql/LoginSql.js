
module.exports = {
  getAllUsersSql: 'select * from user',
  getUserId: 'select user_id from user where username = ? and password = ?'
};
