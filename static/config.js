// This is the runtime configuration file.  It complements the Gruntfile.js by
// supplementing shared properties.
require.config({
  baseUrl: "/static",
  paths: {
    // Make vendor easier to access.
    "vendor": "../vendor",

    // Opt for Lo-Dash Underscore compatibility build over Underscore.
    "underscore": "../vendor/underscore/underscore-min",

    // Map remaining vendor dependencies.
    "jquery": "../vendor/jquery/jquery-min",
    "backbone": "../vendor/backbone/backbone-min",
    "hbs": "../vendor/require-handlebars-plugin/hbs",
    "reveal": "../vendor/reveal/reveal-min",
    "socket.io": "../vendor/socket/socket.io-min"
  },

  hbs: {
      disableI18n: true,              
      templateExtension: 'html',
      helperPathCallback: function (name) {
        return 'templates/helpers/' + name;
      }
  },

  shim: {
    // This is required to ensure Backbone works as expected within the AMD
    // environment.
    "backbone": {
      // These are the two hard dependencies that will be loaded first.
      deps: ["jquery", "underscore"],

      // This maps the global `Backbone` object to `require("backbone")`.
      exports: "Backbone"
    },
    "underscore": {
      exports: "_"
    },
    "reveal": {
      exports: "Reveal"
    }
  }
});
