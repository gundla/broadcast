define([
    'jquery',
    'underscore',
    'backbone',
    'scripts/modules/slides/slidesView'
  ], function($, _, Backbone, SlidesView) {

  // Defining the application router.
  var router = Backbone.Router.extend({
    routes: {
      '': 'index',
      ':action': 'index'
    },

    index: function(action) {
      if(_.isUndefined(action)){
        action = 'view';
      }
      action = action.split('?')[0];
      console.log('action', action)
      new SlidesView({action: action});
    }
  });
  return router;
});
