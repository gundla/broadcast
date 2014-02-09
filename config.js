/*
 * configuration properties that can be overridden for a specific config
 *
 *
 */
var config = module.exports = {
  prod: {
          port                        : 8080
          , logDirectory              : '/mnt/ephemeral/nodejs/logs'
  }
  , qa: {
          port                        : 8080
          , logDirectory              : '/mnt/ephemeral/nodejs/logs'
  }
  , dev: {
          port                        : 8080
          , logDirectory              : '/mnt/ephemeral/nodejs/logs'
  }
  , local: {
          port                        : 4000
          , logDirectory              : ''
  }
}