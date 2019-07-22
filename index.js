var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var log = console.log;
var User = require(__dirname + "/model/User.js");

app.set('view enigne', 'ejs');
app.use(express.static('public'));
app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

app.get('/', (req, res) => {
  res.render(__dirname + "/pages/index.ejs");
});