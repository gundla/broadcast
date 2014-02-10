define([
	'reveal',
	'socket.io'
  ],
  function(Reveal){

	var revealMultiplex = {};

	revealMultiplex.master = function(multiplex){
		// Don't emit events from inside of notes windows
		if ( window.location.search.match( /receiver/gi ) ) { return; }

		var socket = io.connect(multiplex.url);

		var notify = function( slideElement, indexh, indexv, origin ) {
			if( typeof origin === 'undefined' && origin !== 'remote' ) {
				var nextindexh;
				var nextindexv;

				var fragmentindex = Reveal.getIndices().f;
				if (typeof fragmentindex == 'undefined') {
					fragmentindex = 0;
				}

				if (slideElement.nextElementSibling && slideElement.parentNode.nodeName == 'SECTION') {
					nextindexh = indexh;
					nextindexv = indexv + 1;
				} else {
					nextindexh = indexh + 1;
					nextindexv = 0;
				}

				var slideData = {
					indexh : indexh,
					indexv : indexv,
					indexf : fragmentindex,
					nextindexh : nextindexh,
					nextindexv : nextindexv,
					secret: multiplex.secret,
					socketId : multiplex.id
				};

				socket.emit('slidechanged', slideData);
			}
		}

		Reveal.addEventListener( 'slidechanged', function( event ) {
			notify( event.currentSlide, event.indexh, event.indexv, event.origin );
		} );

		var fragmentNotify = function( event ) {
			notify( Reveal.getCurrentSlide(), Reveal.getIndices().h, Reveal.getIndices().v, event.origin );
		};

		Reveal.addEventListener( 'fragmentshown', fragmentNotify );
		Reveal.addEventListener( 'fragmenthidden', fragmentNotify );
	}

	revealMultiplex.client = function(multiplex){
		var socketId = multiplex.id;
		var socket = io.connect(multiplex.url);

		socket.on(multiplex.id, function(data) {
			// ignore data from sockets that aren't ours
			if (data.socketId !== socketId) { return; }

			Reveal.slide(data.indexh, data.indexv, data.indexf, 'remote');
		});
	}

	return revealMultiplex;
});
