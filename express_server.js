const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

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
  const templateVars = { urls: urlDatabase};
  res.render('urls_index', templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.post("/urls/:shortURL/delete", (req, res) => {
  delete urlDatabase[req.params.shortURL]
  // console.log(urlDatabase[req.params.shortURL]);
  res.redirect(`http://localhost:${PORT}/urls`)
});

app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});



app.get("/u/:shortURL", (req, res) => {
  const longURL = urlDatabase[req.params.shortURL]
  res.redirect(longURL);
});

app.post("/urls", (req, res) => {
  const short = generateRandomString()
  urlDatabase[short] = req.body.longURL;
  res.redirect(`http://localhost:${PORT}/urls/${short}`);        // Respond with 'Ok' (we will replace this)
});



app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

