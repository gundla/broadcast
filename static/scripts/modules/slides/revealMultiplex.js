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
		var socketId = multiplex.id;

		socket.on('connect', function(){
			socket.emit('create', 'slides_' + socketId, function(err, room){
				console.log('room created', room)
			});
		});
		socket.on('updateConnectedClients', function(count){
			Reveal.updateConnectedClients(count);
		})
		

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
		
		socket.on('connect', function(){
			socket.emit('join', 'slides_' + socketId, function(err, room){
				console.log('joined room', room)
			});
		});
		
		socket.on('slidechanged', function(data) {
			Reveal.slide(data.indexh, data.indexv, data.indexf, 'remote');
		});
	}

	return revealMultiplex;
});
