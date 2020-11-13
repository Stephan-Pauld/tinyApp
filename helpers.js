const {users, urlDatabase} = require('./express_server');



const getUserByEmail = (users, email) => {
  for (const user in users) {
    if (users[user].email === email) {
      return users[user].id
    }
  }
  return null;
};

module.exports = {getUserByEmail}