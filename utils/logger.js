/*
 * custom-levels.js: Custom logger and color levels in winston
 *
 *
 */

var winston = require('winston');

// Logging levels
var config = {
  levels: {
    info: 0,
    warn: 1,
    error: 2,
    debug: 3
  },
  colors: {
    info: 'green',
    warn: 'yellow',
    error: 'red',
    debug: 'blue'
  }
};

var logger = module.exports = new (winston.Logger)({
  transports: [
    //write to console
    new (winston.transports.Console)({
      colorize: true,
      level: 'debug'
    }),
    //write to a file
    new (winston.transports.File)({
      filename: '/mnt/nodejs/logs/www_main.log'
      , maxsize: '20971520'   // 20MB
      , maxFiles: 10
      , json: false
    })
  ],
  levels: config.levels,
  colors: config.colors
});