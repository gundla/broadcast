define([
	'jquery'
    , 'underscore'
    , 'backbone'
    , 'hbs!templates/modules/slides/index'
    , 'reveal'
    , 'scripts/modules/slides/revealMultiplex'
  ],
  function($, _, Backbone, IndexTemplate, Reveal, Multiplex){

  	function getParameterByName(name) {
      name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
      var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
          results = regex.exec(location.search);
      return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  	}

  	function getShortUrl(longUrl, callback)
	{
	    $.getJSON(
	        "https://api-ssl.bitly.com/v3/shorten?callback=?", 
	        { 
	            'format': 'json',
	            'access_token': '04b406119adf35cbb2944efc8a3f8c91d9cd0c81',
	            'longUrl': longUrl
	        },
	        function(response)
	        {
	            callback(response.data.url);
	        }
	    );
	}

	var SlidesView = Backbone.View.extend({
		el: '#slides'
		, initialize: function(options){
			var self = this,
				action = options.action;

			self.render();
			Reveal.updateConnectedClients = function(count){
				count = count - 1;
				if(count < 0)
					count = 0;
				$('#numberOfClients').html(count);
			}

			// if action is present, get multiplex keys
			if(action.toLowerCase() == 'present'){
				$.post('/token', function(response){
					options.multiplex = {};
					options.multiplex.secret = response.secret;
					options.multiplex.id = response.socketId;
					self.initializeSlides(options);
					var broadcastLink =  window.location.protocol + '//' + window.location.host + '/slides/share?id=' + response.socketId;
					getShortUrl(broadcastLink, function(shortUrl){
						console.log('shortUrl', shortUrl)
						if(!_.isUndefined(shortUrl)){
							broadcastLink = shortUrl;
						}
						$('#broadcastLink')
							.prop('href', broadcastLink)
							.html(broadcastLink);
						$('.broadcastingDetails').show();
						$('#startBroadcasting').hide();
						$('.navbar').fadeIn();
					});
				});
			}else if(action.toLowerCase() == 'view'){
				$('#startBroadcasting').show();
				$('.navbar').fadeIn();
				self.initializeSlides(options);
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
					progress: false,
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
