define([
	'jquery'
    , 'underscore'
    , 'backbone'
    , 'hbs!templates/modules/main/main'
  ],
  function($, _, Backbone, MainTemplate){
	var MainView = Backbone.View.extend({
		el: '#main'
		, initialize: function(){
			  this.render();
		}
		, render: function(){
		      console.log(MainTemplate())
		      var self = this;
		      this.$el.html(MainTemplate());
		      return this;
		}
	});
	return MainView;
});
