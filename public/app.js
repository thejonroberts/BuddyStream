let PORT = 8443;

var localVideo;
var remoteVideo;
var peerConnection;
var uuid;
var serverConnection;
var localStream;

var peerConnectionConfig = {
	iceServers: [
		{ urls: 'stun:stun.services.mozilla.com' },
		{ urls: 'stun:stun.l.google.com:19302' }
	]
};

$(document).ready(() => {
	uuid = uuid();

	localVideo = document.getElementById('localVideo');
	remoteVideo = document.getElementById('remoteVideo');

	// FROM WS npm module example:
	// wsButton.onclick = () => {
	// 	if (ws) {
	// 		ws.onerror = ws.onopen = ws.onclose = null;
	// 		ws.close();
	// 	}

	// 	ws = new WebSocket(`ws://${location.host}`);
	// };
	// 	ws.onerror = () => showMessage('WebSocket error');
	// 	ws.onopen = () => showMessage('WebSocket connection established');
	// 	ws.onclose = () => showMessage('WebSocket connection closed');
	serverConnection = new WebSocket(`wss://${window.location.hostname}:${PORT}`);
	serverConnection.onmessage = gotMessageFromServer;

	var constraints = {
		video: true,
		audio: true
	};

	if (navigator.mediaDevices.getUserMedia) {
		navigator.mediaDevices
			.getUserMedia(constraints)
			.then(getUserMediaSuccess)
			.catch(errorHandler);
	} else {
		alert('Your browser does not support getUserMedia API');
	}
});

function getUserMediaSuccess(stream) {
	localStream = stream;
	localVideo.src = window.URL.createObjectURL(stream);
}

function start(isCaller) {
	peerConnection = new RTCPeerConnection(peerConnectionConfig);
	peerConnection.onicecandidate = gotIceCandidate;
	peerConnection.onaddstream = gotRemoteStream;
	peerConnection.addStream(localStream);

	if (isCaller) {
		peerConnection
			.createOffer()
			.then(createdDescription)
			.catch(errorHandler);
	}
}

function gotMessageFromServer(message) {
	if (!peerConnection) start(false);

	var signal = JSON.parse(message.data);

	// Ignore messages from ourself
	if (signal.uuid == uuid) return;

	if (signal.sdp) {
		peerConnection
			.setRemoteDescription(new RTCSessionDescription(signal.sdp))
			.then(function() {
				// Only create answers in response to offers
				if (signal.sdp.type == 'offer') {
					peerConnection
						.createAnswer()
						.then(createdDescription)
						.catch(errorHandler);
				}
			})
			.catch(errorHandler);
	} else if (signal.ice) {
		peerConnection
			.addIceCandidate(new RTCIceCandidate(signal.ice))
			.catch(errorHandler);
	}
}

function gotIceCandidate(event) {
	if (event.candidate != null) {
		serverConnection.send(JSON.stringify({ ice: event.candidate, uuid: uuid }));
	}
}

function createdDescription(description) {
	console.log('got description');

	peerConnection
		.setLocalDescription(description)
		.then(function() {
			serverConnection.send(
				JSON.stringify({ sdp: peerConnection.localDescription, uuid: uuid })
			);
		})
		.catch(errorHandler);
}

function gotRemoteStream(event) {
	console.log('got remote stream');
	remoteVideo.src = window.URL.createObjectURL(event.stream);
}

function errorHandler(error) {
	console.log(error);
}

// Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
function uuid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000)
			.toString(16)
			.substring(1);
	}

	return (
		s4() +
		s4() +
		'-' +
		s4() +
		'-' +
		s4() +
		'-' +
		s4() +
		'-' +
		s4() +
		s4() +
		s4()
	);
}

/*  FROM WS npm module example: global fetch, WebSocket, location */
// const messages = document.querySelector('#messages');
// const wsButton = document.querySelector('#wsButton');
// const logout = document.querySelector('#logout');
// const login = document.querySelector('#login');

// const showMessage = message => {
// 	messages.textContent += `\n${message}`;
// 	messages.scrollTop = messages.scrollHeight;
// };

// const handleResponse = response => {
// 	return response.ok
// 		? response.json().then(data => JSON.stringify(data, null, 2))
// 		: Promise.reject(new Error('Unexpected response'));
// };

// login.onclick = () => {
// 	fetch('/login', { method: 'POST', credentials: 'same-origin' })
// 		.then(handleResponse)
// 		.then(showMessage)
// 		.catch(err => showMessage(err.message));
// };

// logout.onclick = () => {
// 	fetch('/logout', { method: 'DELETE', credentials: 'same-origin' })
// 		.then(handleResponse)
// 		.then(showMessage)
// 		.catch(err => showMessage(err.message));
// };
