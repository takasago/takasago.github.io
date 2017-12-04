// start local video
function startVideo() {
  // localStream = null;
	getDeviceStream({video: true, audio: false})
	.then(function (stream) { // success
		localStream = stream;
		playVideo(localVideo, stream);
	}).catch(function (error) { // error
   	localStream = null;
		console.error('getUserMedia() error:', error);
		return false;
	});
	return true;
}
// stop local video
function stopVideo() {
	pauseVideo(localVideo);
	stopLocalStream(localStream);
}
function stopLocalStream(stream) {
	let tracks = stream.getTracks();
	if (! tracks) {
		console.warn('NO tracks');
		return;
	}

	for (let track of tracks) {
		track.stop();
	}
}

function getDeviceStream(option) {
	if ('getUserMedia' in navigator.mediaDevices) {
		console.log('navigator.mediaDevices.getUserMadia');
		return navigator.mediaDevices.getUserMedia(option);
	}
	else {
		console.log('wrap navigator.getUserMadia with Promise');
		return new Promise(function(resolve, reject){
			navigator.getUserMedia(option,
				resolve,
				reject
			);
		});
	}
}
function playVideo(element, stream) {
	if ('srcObject' in element) {
		element.srcObject = stream;
	}
	else {
		element.src = window.URL.createObjectURL(stream);
	}
	element.play();
	element.volume = 0;
}
function pauseVideo(element) {
	element.pause();
	if ('srcObject' in element) {
		element.srcObject = null;
	}
	else {
		if (element.src && (element.src !== '') ) {
			window.URL.revokeObjectURL(element.src);
		}
		element.src = '';
	}
}

function callTo(peerId){
  	console.log('callTo: ' + peerId);
  	if (localStream == null) {
   	console.log('callTo(): ' + 'null');
   	console.log('callTo(): data only');

   	var conn = peer.connect(peerId);

      conn.on('open', function() {
       console.log('callTo().conn.on: open');
      });
   	conn.on('stream', function(othersStream) {
       console.log('callTo().conn.on: stream');
    		$('#remote_video').prop('src', URL.createObjectURL(othersStream));
   	});
      conn.on('close', function() {
        console.log('callTo().conn.on: close');
      });
  
    	conn.on('error', function(error){
      		console.error('callTo().conn.on error:', error);
      		return;
    	});
  	} else {
   	console.log('callTo(): video available');

   	var call = peer.call(peerId, localStream);

     call.on('open', function(id) {
       console.log('callTo().call.on: ' + id);
     });
   	call.on('stream', function(othersStream){
       console.log('callTo().call.on: stream');
    		$('#remote_video').prop('src', URL.createObjectURL(othersStream));
   	});
      call.on('close', function() {
        console.log('callTo().call.on: close');
      });
  
    	call.on('error', function(error){
      		console.error('callTo().call.on error:', error);
      		return;
    	});
   }
}

function getUrlVars () {
  var vars = [], max = 0, hash = "", array = "";
  var url = window.location.search;
  
  hash  = url.slice(1).split('&');    
  max = hash.length;
  for (var i = 0; i < max; i++) {
    array = hash[i].split('=');
    vars.push(array[0]);
    vars[array[0]] = array[1];
  }
  
  return vars;
}

function getRandomString() {
  var BaseString ='abcdefghijklmnopqrstuvwxyz';
  
  var  randomString = "";
  
  for(var i =0; i<3; i++) {
    randomString += BaseString[Math.floor(Math.random() * BaseString.length)];
  }
  
  randomString += new Date().getSeconds();
  return randomString;
}
