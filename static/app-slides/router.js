define([
    'jquery',
    'underscore',
    'backbone',
    'reveal',
    'scripts/modules/slides/slidesView'
  ], function($, _, Backbone, Reveal, SlidesView) {

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
      new SlidesView({action: action});
    }
  });
  return router;
});
