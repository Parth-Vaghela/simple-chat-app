const path = require('path');
const http = require('http'); 
const express = require('express');
const app = express();
const server = http.createServer(app);
const socketio = require('socket.io');
const Filter = require('bad-words');
const bodyParser = require('body-parser');
const { generateMessage , generateLocationMessage } = require('./utils/messages');
const port = process.env.PORT || 3000;
const io = socketio(server);

//for using static files
app.use(express.static(path.join(__dirname, '../public')));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

io.on('connection', (socket)=> {
  socket.emit('message', generateMessage('Welcome !'));
  socket.broadcast.emit('message', generateMessage("someone has joined !"));
  socket.on('sendMessage', (message, callback)=> {
    const filter = new Filter();
    if(filter.isProfane(message)){
      return callback('profanity is not allowed !')
    };
    io.emit('message', generateMessage(message));
    callback();
  });
  socket.on('sendLocation', (coords, callback)=> {
    io.emit('locationMessage', generateLocationMessage(`https://google.com/maps?q=${coords.latitude},${coords.longitude}`));
    callback();
  });
  socket.on('disconnect', ()=> {
    io.emit('message', generateMessage('someone has left'));
  });
});

server.listen(port, ()=> {
  console.log(`Server starts on port * ${port}`);
});