var express = require('express');
var app = express();

// other node modules of interest
var _ = require('underscore');
var socketio = require('socket.io');

// utils 
var utils = require('./utils/utils');

//  Initialize logger
var logger = require('./utils/logger');
var loggerStream = {
  write: function(message, encoding){
    logger.info(message);
  }
}
function logErrors(err, req, res, next) {
  logger.error(err.stack);
  next(err);
}
function errorHandler(err, req, res, next) {
  logger.error('500: ' + req.path);

  res.status(500);
  //res.redirect('/static/html/404.html');
  next(err);
}

// Initialize configuration properties
var config = require('./config');

app.configure(function(){
  //fix ip for logs
  app.enable('trust proxy');

  app.use(express.bodyParser());
  app.use(express.methodOverride());

  //access logs
  app.use(express.logger({stream: loggerStream}));

  // routing
  app.use(express.cookieParser());
  app.use(express.session({secret: 'secret'}));

  // set static directory as public and prefex all requests for static resources with static
  app.use(express.static(__dirname + '/static'));
  app.use('/static', express.static(__dirname + '/static'));
  
  app.use(app.router);

  // redirect to custom 404 page
  app.use(function(req, res){
    logger.error('404: ' + req.path);

    res.status(404).sendfile(__dirname + '/static/html/404.html');
    //res.redirect('/static/html/404.html');
  });

  //error handling
  app.use(logErrors);
  app.use(errorHandler);
});

// custom configurations for environment
app.configure('local', function(){
  _.extend(app.locals, config.local);
  logger.transports.file.dirname = app.locals.logDirectory;
});

app.configure('development', function(){
 _.extend(app.locals, config.dev);
  logger.transports.file.dirname = app.locals.logDirectory;
});

app.configure('qa', function(){
  _.extend(app.locals, config.qa);
  logger.transports.file.dirname = app.locals.logDirectory;
});

app.configure('production', function(){
  _.extend(app.locals, config.prod);
  logger.transports.file.dirname = app.locals.logDirectory;
});

// is a route polled by apache to verify node server is running
app.get('/monitor.html', function(req, res, next){
  res.send(200);
});

app.all('/socket.io/1/*', function(req, res, next) {
  console.log('allow origin')
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.post('/token', function(req,res) {
  var ts = new Date().getTime();
  var rand = Math.floor(Math.random()*9999999);
  var secret = ts.toString() + rand.toString();
  res.send({secret: secret, socketId: utils.createHash(secret)});
});

// start the app
var server = app.listen(app.locals.port, function(){
  console.log("Express server listening on port %d in %s mode", app.locals.port, app.settings.env);
});

// initialize socket server
socketio = socketio.listen(server);

// modules
var slideSharing = require('./modules/slideSharing');
var videoSharing = require('./modules/videoSharing');

// namespaced socket connections
slideSharingSocket = socketio.of('/slideSharing');
videoSharingSocket = socketio.of('/videoSharing');

slideSharingSocket.on('connection', function(client){
  slideSharing.init(client);
});

videoSharingSocket.on('connection', function(client){
  videoSharing.init(client, videoSharingSocket);
});