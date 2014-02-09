var videoSharing = {};

function safeCb(cb) {
    if (typeof cb === 'function') {
        return cb;
    } else {
        return function () {};
    }
}


videoSharing.init = function(client, io){

  client.resources = {
      screen: false,
      video: true,
      audio: false
  };

  client.on('message', function(details) {
    var otherClient = io.sockets[details.to];
    if (!otherClient) return;
    details.from = client.id;
    otherClient.emit('message', details);
  });

  client.on('join', join);

  // we don't want to pass "leave" directly because the
  // event type string of "socket end" gets passed too.
  client.on('disconnect', function () {
      removeFeed();
  });

  client.on('leave', removeFeed);

  client.on('create', function (name, cb) {
      // check if exists
      if (io.clients(name).length) {
          safeCb(cb)('taken');
      } else {
          join(name);
          safeCb(cb)(null, name);
      }
  });

  function describeRoom(name) {
    // get all clients for this name
    var clients = io.clients(name);
    var result = {
        clients: {}
    };
    clients.forEach(function (client) {
        result.clients[client.id] = client.resources;
    });
    return result;
  }

  function join(name, cb) {
      // sanity check
      if (typeof name !== 'string') return;
      // leave any existing rooms
      if (client.room) removeFeed();
      safeCb(cb)(null, describeRoom(name))
      client.join(name);
      client.room = name;
  }
  function removeFeed(type) {
      io.in(client.room).emit('remove', {
          id: client.id,
          type: type
      });
  }

  console.log('video sharing initialized');
}

module.exports = videoSharing;