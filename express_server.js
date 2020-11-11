const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser')

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(cookieParser());

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

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
  console.log(`In password check looking for password: ${password} email: ${email}`);
  console.log('=-=-=-=-=-=-=-=-=-');
  console.log(users);
  console.log('=-=-=-=-=-=-=-=-=-');
  for (const user in users) {
    console.log(user);
    console.log(users[user].password);
    // console.log(users[user].email);
  
    if (email === users[user].email) {
      console.log(`The pass is: ${password}`);
      if (users[user].password === password){
        console.log(`we have found the password: ${users[user].password} for user: ${user}`);
        return true;
      }
    } 
    else {
      return false;
    }
  }
};

app.get("/register", (req, res) => {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["user_id"],
    users: users
  };
  res.render("register", templateVars);
});

app.get('/urls', function(req, res) {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["user_id"],
    users: users
  };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["user_id"],
    users: users
  };
  // console.log(req.cookies.UserName);
  res.render("urls_new", templateVars);
});

app.get('/login', function(req, res) {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["user_id"],
    users: users
  };
  res.render('login', templateVars);
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  // console.log(urlDatabase[req.params.shortURL]);
  res.redirect(`http://localhost:${PORT}/urls`)
});

app.post("/urls/:shortURL/edit", (req, res) => {
  // console.log(req.params);
  res.redirect(`http://localhost:${PORT}/urls/${req.params.shortURL}`)
});

app.post("/urls/:shortURL/changeURL", (req, res) => {
  // console.log(req.params.shortURL);
  urlDatabase[req.params.shortURL] = req.body.longURL
  res.redirect(`http://localhost:${PORT}/urls`)
});

app.post("/login", (req, res) => {
  const pass = req.body.password;
  const email = req.body.email;

  if (emailCheck(email)) {
    console.log("Email Looks Good");
    console.log(`Checking password- ${pass}`);
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
  }
});

app.post('/logout', (req, res) => {
  res.clearCookie('user_id');
  res.redirect(`/urls`);
});

app.get("/urls/:shortURL", (req, res) => {

  const templateVars = { 
    username: req.cookies["user_id"],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL],
    users: users
  };
  res.render("urls_show", templateVars);
});

app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  
  const short = generateRandomString()
  urlDatabase[short] = req.body.longURL;
  // console.log(req.body.longURL);
  res.redirect(`http://localhost:${PORT}/urls/${short}`);
});
app.post("/register", (req, res) => {

  if (!emailCheck(req.body.email)){
    if (req.body.email.length === 0 || req.body.password.length < 6) {
      res.statusCode = 400;
      console.log(res.statusCode, 'email is empty or password needs to be 6 characters');
    } else {
      let randId = generateRandomString()
      users[randId] =
        {
        id: randId,
        email: req.body.email, 
        password: req.body.password
      }
      res.redirect('/urls')
    }
  } else {
    console.log("Email Already In Use");
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
