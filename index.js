var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var mongoose = require('mongoose');
var parser = require('body-parser');
var log = console.log;

var User = require(__dirname + '/model/User.js');

app.set('view enigne', 'ejs');
app.use(express.static('public'));
app.use(parser.urlencoded({ extended: false }))
app.use(parser.json());
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

app.get('/', (req, res) => {
  res.render(__dirname + '/pages/index.ejs');
});

app.route('/register')
  .get((req, res) => {
    res.render(__dirname + '/pages/register.ejs');
  })
  .post((req, res) => {
    var user = new User(req.body.username, req.body.email, req.body.password);

    log(user); // will be saved to mongodb later

    // just a test for now, in case there really would be some user with same username
    res.render(__dirname + '/pages/register.ejs', {warning: "This user already exists!"});
  });

app.route('/login')
  .get((req, res) => {
    res.render(__dirname + '/pages/login.ejs');
  })