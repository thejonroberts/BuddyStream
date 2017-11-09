'use strict';

const fs = require('fs');
const express = require('express');
const session = require('express-session');
const app = express();
const https = require('https');
const WebSocket = require('ws');
const methodOverride = require('method-override');
const passport = require('passport');
const bodyParser = require('body-parser');
const flash = require('express-flash');
const expressValidator = require('express-validator');

// WEBSOCKET SERVER SETUP
// ---------------------------
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

// Create HTTPs server.
const server = https.createServer(serverConfig, app);

// Create Websocket on the HTTPS server
const wss = new WebSocket.Server({ server });

// handlers for websocket events
wss.on('connection', function(ws, req) {
	ws.on('message', function(message) {
		// Broadcast any received message to all clients
		// console.log('received: %s', message);
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

// EXPRESS SETUP
// Serve static files from the 'public' folder.
app.use('/public', express.static(__dirname + '/public'));
app.use(sessionParser);
app.set('view engine', 'pug');
app.set('models', require('./models'));

// Begin middleware stack
app.use(
	methodOverride(function(req, res) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			let method = req.body._method;
			return method;
		}
	})
);

// PASSPORT SESSION SETUP:
require('./config/passport-strat.js');
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
// add the logged-in user's info to the locals variable,
app.use((req, res, next) => {
	res.locals.session = req.session;
	next();
});

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash()); // TODO - custom messages on login/logout
// validation - must be after bodyParser as it uses bodyParser to access parameters
app.use(expressValidator());

let routes = require('./routes/');
app.use(routes);

// TODO Add a 404 error handler - pipe all server errors to from the routing middleware

// Start the express app via https server.
server.listen(HTTPS_PORT, () => {
	/* eslint-disable */
	console.log(
		`Server running. Visit https://localhost:${HTTPS_PORT} (note the HTTPS; there is no HTTP -> HTTPS redirect!)`
	);
	/* eslint-enable */
});
