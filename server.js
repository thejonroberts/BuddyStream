'use strict';

const fs = require('fs');
const uuid = require('uuid');
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

// EXPRESS SETUP
// Serve static files from the 'public' folder.
app.use(express.static('public'));
app.use(sessionParser);
app.set('models', require('./models'));
app.set('view engine', 'pug');
// app.locals.globalWow = 'Something we need globally?';

// Begin middleware stack
app.use(
	methodOverride(function(req, res) {
		if (req.body && typeof req.body === 'object' && '_method' in req.body) {
			let method = req.body._method;
			return method;
		}
	})
);

//execute passport strategies file
// require('./config/passport-strat.js');
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
// This custom middleware adds the logged-in user's info to the locals variable,
// so we can access it in the Pug templates
// app.use((req, res, next) => {
// 	res.locals.session = req.session;
// 	// console.log('res.locals.session', res.locals.session);
// 	next();
// });
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(flash());

// validation - must be after bodyParser as it uses bodyParser to access parameters
app.use(expressValidator());

// TODO Add a 404 error handler - pipe all server errors to from the routing middleware

let routes = require('./routes/');
// note that this needs to be after the above stuff
app.use(routes);

// Start the express app via https server.
server.listen(HTTPS_PORT, () => {
	console.log(
		`Server running. Visit https://localhost:${HTTPS_PORT} (note the HTTPS; there is no HTTP -> HTTPS redirect!)`
	);
});
