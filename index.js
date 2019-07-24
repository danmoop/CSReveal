var express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);
var parser = require('body-parser');
var log = console.log;

app.set('view enigne', 'ejs');
app.use(express.static('public'));
app.use(parser.urlencoded({
  extended: false
}))
app.use(parser.json());
http.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});

var rooms = [];

app.get('/', (req, res) => {
  res.render(__dirname + '/pages/index.ejs');
});

app.get('/room/:roomId', (req, res) => {
  var room = getRoomById(req.params.roomId);

  if (room == null || room.users.length > 1) {
    res.redirect('/');
  } else {
    res.render(__dirname + '/pages/coderoom.ejs', {
      roomObj: room
    });
  }
});

app.post('/generateRoom', (req, res) => {
  var _id = generateKey();

  var room = {
    id: _id,
    users: []
  }

  rooms.push(room);

  res.render(__dirname + '/pages/index.ejs', {
    roomId: _id
  });
});

app.get('/data', (req, res) => {
  res.send(h1("<a href='/'>Home</a><br>Rooms: " + JSON.stringify(rooms)));
});

function h1(text) {
  return `<h1 style="font-family: calibri;">${text}</h1>`;
}

function generateKey() {
  var result = "";
  var possible = "qwertyuioplkjhgfdsazxcvbnm1234567890";

  for (var i = 0; i < 15; i++) {
    result += possible[Math.floor(Math.random() * possible.length)];
  }

  return result;
}

function getRoomById(id) {
  return rooms.filter(room => room.id == id)[0];
}

io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    var room = rooms.filter(room => room.users.indexOf(socket.id) != -1)[0];
    room.users.splice(room.users.indexOf(socket.id), 1);

    if (room.users.length == 0) {
      rooms.splice(rooms.indexOf(room), 1);
    }
  });

  socket.on('joinedRoom', (data) => {
    var room = getRoomById(data.roomId);
    
    room.users.push(data.clientId);
  });

  socket.on('textChanged', (data) => {
    var room = getRoomById(data.roomId);

    room.users.forEach(user => {
      if(user != socket.id) {
        io.sockets.connected[user].emit('applyText', data.content);
      }
    });
  })
});