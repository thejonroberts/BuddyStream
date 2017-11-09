const PORT = 8443;

// set user id
let uuid = createUUID();
// const video = document.querySelector('.player');
const canvas = document.querySelector('.canvas');
let ctx = canvas.getContext('2d');
// video html elements
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

// option button elements/listeners
const theaterButton = document.getElementById('enterTheater');
theaterButton.addEventListener('click', () => {
	paintToCanvas();
});
// remoteVideo.addEventListener('canplaythrough', paintToCanvas);
// localVideo.addEventListener('play', paintToCanvas(localVideo));
// video.addEventListener('canplay', paintToCanvas);
// connect button - move handler here (from html)

//
// - RTC: get user media (webcam), and start RTC peer connection
//
// RTC setup
let localStream = null;
let peerConnection = null;
const peerConnectionConfig = {
	iceServers: [
		{ urls: 'stun:stun.services.mozilla.com' },
		{ urls: 'stun:stun.l.google.com:19302' }
	]
};
// initialize websocket connection
const serverConnection = new WebSocket(
	`wss://${window.location.hostname}:${PORT}`
);
serverConnection.onmessage = gotMessageFromServer;

const constraints = {
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

function getUserMediaSuccess(stream) {
	localStream = stream;
	localVideo.src = window.URL.createObjectURL(stream);
}

// called by "Connect" Button
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
//
// end of RTC handling ---------------------------------------------

// From example - Taken from http://stackoverflow.com/a/105074/515584
// Strictly speaking, it's not a real UUID, but it gets the job done here
function createUUID() {
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

// WEBCAM / CANVAS EFFECTS

function paintToCanvas() {
	const localWidth = localVideo.videoWidth;
	const localHeight = localVideo.videoHeight;
	let remoteWidth = 0;
	let remoteHeight = 0;
	// make canvas larger than video resolution, to avoid grainy scaling when drawing to canvas.
	canvas.width = localWidth * 4;
	canvas.height = localHeight * 4;
	let marginBottom = canvas.height * 0.1;
	let marginLeft = canvas.width * 0.05;
	// if remote video is active, grab dimensions
	if (remoteVideo.src) {
		remoteWidth = remoteVideo.videoWidth;
		remoteHeight = remoteVideo.videoHeight;
	}

	return setInterval(() => {
		// (src, xstart, ystart(topleft), xlength, ylength)
		ctx.drawImage(
			localVideo,
			0 + marginLeft,
			canvas.height - localHeight - marginBottom,
			localWidth,
			localHeight
		);
		// if remote, draw it next to local
		if (remoteVideo.src) {
			ctx.drawImage(
				remoteVideo,
				localWidth + marginLeft,
				canvas.height - remoteHeight - marginBottom,
				remoteWidth,
				remoteHeight
			);
		}
		// take pixels out - need to either take whole canvas, or just video portion, and place in same place with putImageData below
		let pixels = ctx.getImageData(
			marginLeft,
			canvas.height - localHeight - marginBottom,
			localWidth + remoteWidth,
			localHeight
		);
		// add effects - greenscreen first, then apply effect
		pixels = greenScreen(pixels);
		pixels = silhouetteEffect(pixels);
		// put altered image back on canvas - has to be same coordinates from getImageData!! otherwise tiling occurs
		ctx.putImageData(
			pixels,
			marginLeft,
			canvas.height - localHeight - marginBottom
		);
	}, 20);
}

// apply effect to webcam
function silhouetteEffect(pixels) {
	for (let i = 0; i < pixels.data.length; i += 4) {
		pixels.data[i + 0] = 0; // red
		pixels.data[i + 1] = 0; // green
		pixels.data[i + 2] = 0; // blue
	}
	return pixels;
}

// take pixels that match certain RGB value to transparent (remove from video)
function greenScreen(pixels) {
	const levels = {};

	// Select input sliders and grab values
	document.querySelectorAll('.rgb input').forEach(input => {
		levels[input.name] = input.value;
	});

	for (let i = 0; i < pixels.data.length; i = i + 4) {
		let red = pixels.data[i + 0];
		let green = pixels.data[i + 1];
		let blue = pixels.data[i + 2];
		// let alpha = pixels.data[i + 3];
		// if between slider values
		if (
			red >= levels.rmin &&
			red <= levels.rmax &&
			green >= levels.gmin &&
			green <= levels.gmax &&
			blue >= levels.bmin &&
			blue <= levels.bmax
		) {
			// take it out by setting alpha to zero
			pixels.data[i + 3] = 0;
		}
	}
	// return image with out of range pixels removed
	return pixels;
}

// FROM WS npm module example  - after declarations top of doc.ready fn
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
