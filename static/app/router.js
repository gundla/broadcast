define([
    'backbone',
    'scripts/modules/main/mainView'
  ], function(Backbone, MainView) {

  // Defining the application router.
  var router = Backbone.Router.extend({
    routes: {
      '': 'index'
    },

    index: function() {
      new MainView();
    }
  });
  return router;
});
