'use strict';

// this is a hybrid of two webrtc example projects
// TODO sing their praises in the readme!

require('dotenv').config();
const HTTPS_PORT = process.env.HTTPS_PORT;
const PORT = 8443;

const session = require('express-session');
const express = require('express');
const uuid = require('uuid');
const app = express();
const fs = require('fs');
const https = require('https');
const WebSocket = require('ws');

const serverConfig = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};
//
// We need the same instance of the session parser in express and
// WebSocket server.
//
const sessionParser = session({
	saveUninitialized: false,
	secret: '$eCuRiTy',
	resave: false
});
//
// Serve static files from the 'public' folder.
//
app.use(express.static('public'));
app.use(sessionParser);

// TODO - use this to login / authenticate user
// app.post('/login', (req, res) => {
// 	//
// 	// "Log in" user and set userId to session.
// 	//
// 	const id = uuid.v4();

// 	console.log(`Updating session for user ${id}`);
// 	req.session.userId = id;
// 	res.send({ result: 'OK', message: 'Session updated' });
// });

// app.delete('/logout', (request, response) => {
// 	console.log('Destroying session');
// 	request.session.destroy();
// 	response.send({ result: 'OK', message: 'Session destroyed' });
// });

//
// Create HTTP server by ourselves.
//
const server = https.createServer(serverConfig, app);
//-- example
// var httpsServer = https.createServer(serverConfig, handleRequest);
// server.listen(HTTPS_PORT, '0.0.0.0');

const wss = new WebSocket.Server({
	// verifyClient: (info, done) => {
	// 	console.log('Parsing session from request...');
	// 	sessionParser(info.req, {}, () => {
	// 		console.log('Session is parsed!');
	// 		//
	// 		// We can reject the connection by returning false to done(). For example,
	// 		// reject here if user is unknown.
	// 		//
	// 		done(info.req.session.userId);
	// 	});
	// },
	server
});

// wss.on('connection', (ws, req) => {
// 	ws.on('message', message => {
// 		//
// 		// Here we can now use session parameters.
// 		//
// 		console.log(`WS message ${message} from user ${req.session.userId}`);
// 	});
// });

//-SERVER STARTED IN ABOVE EXAMPLE

// BEGINNING OF SIMPLE WEBRTC EXAMPLE
// TODO move this to .env
// const HTTPS_PORT = 8443;

// const fs = require('fs');
// const https = require('https');
// const WebSocket = require('ws');
// const WebSocketServer = WebSocket.Server;

// Yes, SSL is required
// const serverConfig = {
// 	key: fs.readFileSync('key.pem'),
// 	cert: fs.readFileSync('cert.pem')
// };

// ----------------------------------------------------------------------------------------

// THIS SHOULD BE HANDLED BY EXPRESS /public routing
// Create a server for the client html page
// var handleRequest = function(request, response) {
// 	// Render the single client html file for any request the HTTP server receives
// 	console.log('request received: ' + request.url);

// 	if (request.url === '/') {
// 		response.writeHead(200, { 'Content-Type': 'text/html' });
// 		response.end(fs.readFileSync('client/index.html'));
// 	} else if (request.url === '/webrtc.js') {
// 		response.writeHead(200, { 'Content-Type': 'application/javascript' });
// 		response.end(fs.readFileSync('client/webrtc.js'));
// 	}
// };

// var httpsServer = https.createServer(serverConfig, handleRequest);
// httpsServer.listen(HTTPS_PORT, '0.0.0.0');

// ----------------------------------------------------------------------------------------

// Create a server for handling websocket calls
// var wss = new WebSocketServer({ server: httpsServer });

wss.on('connection', function(ws) {
	ws.on('message', function(message) {
		// Broadcast any received message to all clients
		console.log('received: %s', message);
		wss.broadcast(message);
	});
});

wss.broadcast = function(data) {
	this.clients.forEach(function(client) {
		if (client.readyState === WebSocket.OPEN) {
			client.send(data);
		}
	});
};

//
// Start the server.
//
server.listen(HTTPS_PORT, () => {
	console.log(
		'Server running. Visit https://localhost:' +
			HTTPS_PORT +
			' (note the HTTPS; there is no HTTP -> HTTPS redirect!)'
	);
});
