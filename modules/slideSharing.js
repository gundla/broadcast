var slideSharing = {};

slideSharing.init = function(client){
  
  client.on('slidechanged', function(slideData) {
  	console.log('slidechanged')
    if (typeof slideData.secret == 'undefined' || slideData.secret == null || slideData.secret === '') return;
    //if (utils.createHash(slideData.secret) === slideData.socketId) {
      slideData.secret = null;
      client.broadcast.emit(slideData.socketId, slideData);
    //};
  });

  console.log('slide sharing initialized');
}

module.exports = slideSharing;