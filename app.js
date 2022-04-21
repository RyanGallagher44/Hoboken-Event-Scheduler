// CS546-A
// Final Project
// 05/08/2022
// I pledge my honor that I have abided by the Stevens Honor System.

const express = require('express');
const session = require('express-session')
const app = express();
const static = express.static(__dirname + '/public');

const configRoutes = require('./routes');
const exphbs = require('express-handlebars');

app.use('/public', static);
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(session({
    name: 'AuthCookie',
    secret: 'This is a test of the emergency broadcast system.',
    resave: false,
    saveUninitialized: true
}));

app.engine('handlebars', exphbs.engine({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

configRoutes(app);

app.listen(3000, () => {
  console.log("We've now got a server!");
  console.log('Your routes will be running on http://localhost:3000');
});