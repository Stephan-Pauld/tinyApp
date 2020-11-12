const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
// const {generateRandomString, emailCheck, idCheck, passwordCheck, findUserURLS} = require('./helper')

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(cookieParser());

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
}

// ############################################
// ##FUNCTIONS LETS TOSS IN A HELPER FILE!!!!##
// ############################################

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
    // console.log(user);
    if (email === users[user].email) {
      if (bcrypt.compareSync(password, users[user].password)) {
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

// ##################
// ## GET REQUESTS ##
// ##################

app.get("/register", (req, res) => {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["user_id"],
    users: users
  };
  res.render("register", templateVars);
});

app.get('/urls', function (req, res) {
  const myUrl = findUserURLS(req.cookies['user_id'])
  const templateVars = {
    urls: myUrl,
    username: req.cookies["user_id"],
    users: users
  };
  console.log(templateVars.username);
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["user_id"],
    users: users
  };
  if (!req.cookies.user_id) {
    console.log('I see NO COOKIESSS NOMNOMNOM');
    return res.redirect("/login");
  }
  res.render("urls_new", templateVars);
});

app.get('/login', function (req, res) {
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies["user_id"],
    users: users
  };
  console.log(users);
  res.render('login', templateVars);
});

app.get("/urls/:shortURL", (req, res) => {
  console.log(req.params);
  const templateVars = {
    username: req.cookies["user_id"],
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL].longURL,
    users: users
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL].longURL
  res.redirect(longURL);
});

app.post("/urls/:shortURL/delete", (req, res) => {

  if (req.cookies["user_id"] === urlDatabase[req.params.shortURL].userID) {
    delete urlDatabase[req.params.shortURL]
  }
  res.redirect(`http://localhost:${PORT}/urls`)
});

// ####################
// ## POST REQUESTS  ##
// ####################


app.post("/urls/:shortURL/edit", (req, res) => {

  res.redirect(`http://localhost:${PORT}/urls/${req.params.shortURL}`)
});

app.post("/urls/:shortURL/changeURL", (req, res) => {
  // console.log(req.params.shortURL);
  urlDatabase[req.params.shortURL].longURL = req.body.longURL
  res.redirect(`http://localhost:${PORT}/urls`)
});


app.post("/login", (req, res) => {
  const pass = req.body.password;
  const email = req.body.email;

  if (emailCheck(email)) {
    // console.log("Email Looks Good");
    // console.log(`Checking password- ${pass}`);
    if (passwordCheck(pass, email)) {
      console.log("login looks good");
      let id = idCheck(email);
      res.cookie('user_id', id)
      return res.redirect(`http://localhost:${PORT}/urls`)
    } else {
      // NEED TO RETURN A 403 STATUS CODE
      console.log('Wrong Password');
    }
  } else {
    // NEED TO RETURN A 403 STATUS CODE
    console.log("invalid Email");
    return res.redirect("/login");
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});
app.post("/urls", (req, res) => {

  const short = generateRandomString()
  urlDatabase[short] = { longURL: req.body.longURL, userID: req.cookies["user_id"] }
  res.redirect(`http://localhost:${PORT}/urls/${short}`);
});
app.post("/register", (req, res) => {

  if (!emailCheck(req.body.email)) {

    if (req.body.email.length === 0 || req.body.password.length < 2) {
      res.statusCode = 400;
      console.log(res.statusCode, 'email is empty or password needs to be 6 characters');

    } else {
      let randId = generateRandomString()
      users[randId] =
      {
        id: randId,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 2)
      }
      // console.log(bcrypt.compareSync(req.body.password, bcrypt.hashSync(req.body.password, 2)));
      console.log("Account Created", req.body.email, req.body.password);
      return res.redirect('/login')
    }
  } else {
  }
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

// Not Sure If this Is doing anything!!!....
// invalid old code I think!
// ###########################################
// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-

// app.post("/urls/:shortURL", (req, res) => {
//   const short = req.params.shortURL
//   // console.log(short);
//   // console.log(urlDatabase[short]);
//   // res.redirect(`http://localhost:${PORT}/urls`)
// });

// I wrote this for my  app.post("/login", (req, res) but asked a senior mentor if this is propper and its a bit hard to read!

// =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
  // if (emailCheck(req.body.email, (id) => {
  //   if (users[id].password === req.body.password) {
  //     console.log("Login Looks Swell");
  //     // res.cookie('user_id',)
  //     // res.redirect(`http://localhost:${PORT}/urls`)
  //   } else {
  //     console.log("incorrect password");
  //   }
  // }));
  // console.log("Something")
  // =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
