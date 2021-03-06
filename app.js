var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var compression = require('compression');

var routes = require('./routes/index');
var sounds = require('./routes/sounds');
var speech = require('./routes/speech');
var slack = require('./routes/slack');

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')();

// mount io
app.io = io;

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes(io));
app.use('/slack', slack);
app.use('/speech', speech(io));
app.use('/sounds', sounds(io));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

var roomList = [];

io.on('connection', function(socket) {
  socket.on('getRooms', function(){
    socket.emit('roomList', roomList);
  });

  socket.on('joinroom', function(room){
    socket.room = room;
    socket.join(socket.room);
    console.log('user connected to', socket.room);
    io.to(socket.room).emit('notification', 'user has connected');
    io.to(socket.room).emit('listeners', io.sockets.adapter.rooms[room].length);
    roomList.push(socket.room);
    io.emit('roomList', roomList);
  });

  socket.on('disconnect', function() {
    if(socket.room){
      socket.leave(socket.room);
      const listeners = io.sockets.adapter.rooms[socket.room] ? io.sockets.adapter.rooms[socket.room].length : 0;
      io.to(socket.room).emit('listeners', listeners);
      console.log('user disconnected from', socket.room);
      roomList.splice(roomList.indexOf(socket.room), 1);
      io.emit('roomList', roomList);
    }
  });
});

module.exports = app;
