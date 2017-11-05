'use strict';

const fs = require('fs');
const uuid = require('uuid');
const express = require('express');
const session = require('express-session');
const app = express();
const https = require('https');
const WebSocket = require('ws');
require('dotenv').config();
const PORT = 8443;
const HTTPS_PORT = process.env.HTTPS_PORT || PORT;
// SSL certicate info from files
const serverConfig = {
	key: fs.readFileSync('key.pem'),
	cert: fs.readFileSync('cert.pem')
};

// We need the same instance of the session parser in express and WebSocket server.
const sessionParser = session({
	saveUninitialized: false,
	secret: '$eCuRiTy',
	resave: false
});

// Serve static files from the 'public' folder.
app.use(express.static('public'));
app.use(sessionParser);

// TODO - use this to login / authenticate user (sessionParser v token v other?)
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

// Create HTTPs server.
const server = https.createServer(serverConfig, app);

// Create Websocket on the HTTPS server
const wss = new WebSocket.Server({
	// verifyClient: (info, done) => {
	// 	console.log('Parsing session from request...');
	// 	sessionParser(info.req, {}, () => {
	// 		console.log('Session is parsed!');
	// 		// We can reject the connection by returning false (if no user) to done().
	// 		done(info.req.session.userId);
	// 	});
	// },
	server
});

// handlers for websocket events
wss.on('connection', function(ws, req) {
	ws.on('message', function(message) {
		// Broadcast any received message to all clients
		console.log('received: %s', message);
		// Here we can also use session parameters.
		// console.log(`WS message ${message} from user ${req.session.userId}`);
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

// Start the express server.
server.listen(HTTPS_PORT, () => {
	console.log(
		`Server running. Visit https://localhost:${HTTPS_PORT} (note the HTTPS; there is no HTTP -> HTTPS redirect!)`
	);
});
