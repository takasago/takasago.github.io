// start local video
function startVideo() {
	getDeviceStream({video: true, audio: false})
	.then(function (stream) { // success
		localStream = stream;
		playVideo(localVideo, stream);
	}).catch(function (error) { // error
		console.error('getUserMedia error:', error);
		return;
	});
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
	var call = peer.call(peerId, localStream);

	call.on('stream', function(othersStream){
		$('#remote_video').prop('src', URL.createObjectURL(othersStream));
	});
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
