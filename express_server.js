const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const { getUserByEmail } = require('./helpers');

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieSession({
  name: 'session',
  keys: ['waterbottle']
}));

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userID: "userRandomID" },
  i3BoGr: { longURL: "https://www.google.ca", userID: "aJ48lW" }
};

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "123"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};

const generateRandomString = () => {
  let newId = "";
  const len = 6;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < len; i++) {
    newId += letters[(Math.floor(Math.random() * letters.length))];
  }
  return newId;
};

const emailCheck = (email) => {
  for (const user in users) {
    if (email === users[user].email) {
      return true;
    }
  }
  return false;
};

const passwordCheck = (password, email) => {
  for (const user in users) {
    if (email === users[user].email) {
      if (bcrypt.compareSync(password, users[user].password)) {
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

// ##################
// ## GET REQUESTS ##
// ##################

app.get("/register", (req, res) => {
  if (req.session.user_id) {
    return res.redirect("/urls");
  }
  const templateVars = {
    urls: urlDatabase,
    username: req.session.user_id,
    users: users
  };
  res.render("register", templateVars);
});

app.get('/urls', function(req, res) {
  const myUrl = findUserURLS(req.session['user_id']);
  const templateVars = {
    urls: myUrl,
    username: req.session.user_id,
    users: users
  };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.session.user_id,
    users: users
  };
  if (!req.session.user_id) {
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.get('/login', function(req, res) {
  if (req.session.user_id) {
    res.redirect("/urls")
  }
  const templateVars = {
    urls: urlDatabase,
    username: req.session.user_id,
    users: users
  };
  res.render('login', templateVars);
});

app.get("/urls/:shortURL", (req, res) => {

  if (req.params.shortURL) {

    const templateVars = {
      username: req.session.user_id,
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL] && urlDatabase[req.params.shortURL].longURL,
      users: users,
      myURLS: findUserURLS(req.session.user_id)
    };
    return res.render("urls_show", templateVars);
  }
});

app.get("/u/:shortURL", (req, res) => {
  
  if (!Object.keys(urlDatabase).includes(req.params.shortURL)) {
    return res.send({ERROR: "Invalid URL"})    
  }
  const longURL = urlDatabase[req.params.shortURL].longURL;
  res.redirect(longURL);
});

app.get("/", (req, res) => {
  res.redirect(`http://localhost:${PORT}/urls`);
});

app.post("/urls/:shortURL/delete", (req, res) => {

  if (req.session.user_id === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL];
  }
  res.redirect(`http://localhost:${PORT}/urls`);
});

// ####################
// ## POST REQUESTS  ##
// ####################

app.post("/urls/:shortURL/edit", (req, res) => {

  res.redirect(`http://localhost:${PORT}/urls/${req.params.shortURL}`);
});

app.post("/urls/:shortURL/changeURL", (req, res) => {
  urlDatabase[req.params.shortURL].longURL = req.body.longURL;
  res.redirect(`http://localhost:${PORT}/urls`);
});


app.post("/login", (req, res) => {
  const pass = req.body.password;
  const email = req.body.email;

  if (emailCheck(email)) {
    console.log("Email Looks Good");
    if (passwordCheck(pass, email)) {
      console.log("login looks good");
      req.session.user_id = getUserByEmail(users, req.body.email);
      return res.redirect(`http://localhost:${PORT}/urls`);
    }
  }
  const templateVars = {
    fail: "Incorrect information",
    urls: urlDatabase,
    username: req.session.user_id,
    users: users
  };
  return res.render("login", templateVars);
});

app.post('/logout', (req, res) => {
  req.session = null;
  res.redirect(`/urls`);
});
app.post("/urls", (req, res) => {

  const short = generateRandomString();
  urlDatabase[short] = { longURL: req.body.longURL, userID: req.session.user_id };
  res.redirect(`http://localhost:${PORT}/urls/${short}`);
});
app.post("/register", (req, res) => {

  if (!emailCheck(req.body.email)) {

    if (req.body.email.length === 0 || req.body.password.length < 6) {
      res.statusCode = 400;
      const templateVars = {
        urls: urlDatabase,
        username: req.session.user_id,
        users: users,
        password: "Email need to be correct and Password mus be 6 characters"
      };
      return res.render("register", templateVars);
    } else {
      let randId = generateRandomString();
      users[randId] =
      {
        id: randId,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 2)
      };
      console.log("Account Created", req.body.email, req.body.password);
      req.session.user_id = getUserByEmail(users, req.body.email);
      return res.redirect(`http://localhost:${PORT}/urls`);
    }
  }
  const templateVars = {
    urls: urlDatabase,
    username: req.session.user_id,
    users: users,
    email: "Email already registered",
  };
  return res.render("register", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = { users, urlDatabase };
