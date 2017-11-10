# BuddyStream
A chat app to watch streams together.

The app uses WebRTC protocols to set up a peer-to-peer webcam chat.  The feeds from both video streams can then be processed/filtered and rendered on a canvas overlay of the movie (a la MST3k).

The backend is a Node server using Sequelize to interact with PostgreSQL data and serves it up via express.  The express server is also handling the signaling for the WebRTC protocols via a web socket.

To see it in action:

You will need postgresql and sequelize installed.

Clone the project to a local folder.

You will need to generate a secure key/certificate pair (named 'cert.pem' and 'key.pem') for the server. Websocket transmission of user media requires a secure (wss) connection. To do that easily run:

```generate cert.sh```

Then run the following commands:

```npm install```

```npm run faker```

```npm run dbrb```

```npm start```

Then point your browser at https://localhost:8443

A .env file is also used for environmental variables - you can remove the .example from the included .env.example, and change the port in that file if you wish.

Here are some awesome websocket/weRTC examples that i relied on:
https://github.com/websockets/ws/tree/master/examples/express-session-parse
https://github.com/shanet/WebRTC-Example

more useful info:
https://codelabs.developers.google.com/codelabs/webrtc-web/#0
http://web-engineering.info/node/57


