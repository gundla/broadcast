define([
	'jquery'
    , 'underscore'
    , 'backbone'
    , 'hbs!templates/modules/slides/index'
    , 'scripts/modules/slides/revealMultiplex'
  ],
  function($, _, Backbone, IndexTemplate, Multiplex){

  	function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  	} 

	var SlidesView = Backbone.View.extend({
		el: '#slides'
		, initialize: function(options){
			var self = this,
				action = options.action;

			self.render();

			// if action is present, get multiplex keys
			if(action.toLowerCase() == 'present'){
				$.post('/token', function(response){
					options.multiplex = {};
					options.multiplex.secret = response.secret;
					options.multiplex.id = response.socketId;
					self.initializeSlides(options);
					$('#header a').prop('href', window.location.protocol + '//' + window.location.host + '/app-slides/#share?id=' + response.socketId);
				});
			}else{
				self.initializeSlides(options);
			}
		}
		, render: function(){
		      var self = this;
		      this.$el.html(IndexTemplate());
		      return this;
		}
		, initializeSlides: function(options){
			var action = options.action,
				revealOptions = {
					controls: false,
					progress: true,
					history: false,
					center: true,

					transition: 'linear' // default/cube/page/concave/zoom/linear/fade/none
				},
				slideSharingSocketUrl = '/slideSharing';

			if(action.toLowerCase() == 'present'){
				revealOptions.multiplex = {
					url: slideSharingSocketUrl,
					secret: options.multiplex.secret,
					id: options.multiplex.id
				}
				Multiplex.master(revealOptions.multiplex);
			}
			if(action.toLowerCase() == 'share'){
				revealOptions.multiplex = {
					url: slideSharingSocketUrl,
					secret: null,
					id: getParameterByName('id')
				}
				console.log('revealOptions.multiplex', revealOptions.multiplex)
				Multiplex.client(revealOptions.multiplex);
			}

			Reveal.initialize(revealOptions);
		}
	});
	return SlidesView;
});
