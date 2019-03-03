
module.exports = {
  isUsernameUnique: 'select count(username) as count from user where username = ?',
  register:
    'insert into user(user_id, first_name, last_name, username, password, email, phone_number) ' +
    'values(null, ?, ?, ?, ?, ?, ?)'
};
