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

function generateRandomString() {
  let newId = "";
  const len = 6;
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < len; i++) {
    newId += letters[(Math.floor(Math.random() * letters.length))];
  }
  return newId;
}


app.get('/urls', function(req, res) {
  const templateVars = { 
    urls: urlDatabase,
    username: req.cookies["username"]
  };
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  const templateVars = {
    username: req.cookies["username"]
  };
  // console.log(req.cookies.UserName);
  res.render("urls_new", templateVars);
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

// Not Sure If this Is doing anything!!!....
// ###########################################

// app.post("/urls/:shortURL", (req, res) => {
//   const short = req.params.shortURL
//   // console.log(short);
//   // console.log(urlDatabase[short]);
//   // res.redirect(`http://localhost:${PORT}/urls`)
// });

app.post("/login", (req, res) => {
  console.log("Setting cookies");
  console.log(req.body.username);
  res.cookie('username', req.body.username);
  res.redirect(`http://localhost:${PORT}/urls`)
});

app.post('/logout', (req, res) => {
  res.clearCookie('username');
  res.redirect(`/urls`);
});

app.get("/urls/:shortURL", (req, res) => {

  const templateVars = { 
    username: req.cookies["username"],
    shortURL: req.params.shortURL, 
    longURL: urlDatabase[req.params.shortURL]
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



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

