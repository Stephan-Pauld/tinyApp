function generateRandomString() {
  let newId = "";
  const len = 6;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < len; i++) {
    newId += letters[(Math.floor(Math.random() * letters.length))];
  }
  return newId;
}

const emailCheck = (email) => {
  for (const user in users) {
    if (email === users[user].email) {
      return true;
    }
  }
  return false;
};

const idCheck = (email) => {
  for (const user in users) {
    if (email === users[user].email) {
      return user;
      // console.log(users[user].email,"Match");
    }
  }
  return false;
};

const passwordCheck = (password, email) => {
  for (const user in users) {
    console.log(user);
    if (email === users[user].email) {
      console.log(`The pass is: ${password}`);
      if (users[user].password === password) {
        console.log(`we have found the password: ${users[user].password} for user: ${user}`);
        return true;
      }
    }
  }
  return false;
};

const findUserURLS = (userID) => {
  let result = {};

  for (const shorURL in urlDatabase) {
    if (urlDatabase[shorURL].userID === userID) {
      result[shorURL] = urlDatabase[shorURL];
    }
  }
  return result;
};

module.exports = {generateRandomString, emailCheck, idCheck, passwordCheck, findUserURLS}