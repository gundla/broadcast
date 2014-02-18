var slideSharing = {};
var utils = require('../utils/utils');

function safeCb(cb) {
    if (typeof cb === 'function') {
        return cb;
    } else {
        return function () {};
    }
}

slideSharing.init = function(client, io){
  
  client.on('slidechanged', function(slideData) {
    if (typeof slideData.secret == 'undefined' || slideData.secret == null || slideData.secret === '') return;
    if (utils.createHash(slideData.secret) === slideData.socketId) {
      slideData.secret = null;
      io.in(client.room).emit('slidechanged', slideData);
    };
  });

  client.on('create', function (name, cb) {
      // check if exists
      if (io.clients(name).length) {
          safeCb(cb)('taken');
      } else {
          join(name);
      }
  });
  client.on('join', function(name, cb){
  	join(name);
  	io.in(name).emit('updateConnectedClients', io.clients(name).length);
  });
  client.on('disconnect', function () {
  	setTimeout(function(){
  		removeFeed();
  	}, 1000);
  });

  //client.on('leave', removeFeed);

  function join(name, cb) {
      // sanity check
      if (typeof name !== 'string') return;
      // leave any existing rooms
      if (client.room) removeFeed();
      client.join(name);
      client.room = name;
      safeCb(cb)(null, name);
  }
  function removeFeed(type) {
      //io.in(client.room).emit('remove');
      io.in(client.room).emit('updateConnectedClients', io.clients(client.room).length);
  }

  console.log('slide sharing initialized');
}

module.exports = slideSharing;