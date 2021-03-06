// server/index.js
const WebSocketServer = require('ws').Server;
const path = require('path');
const http = require('http');
const express = require("express");
var wss = null, sslSrv = null;
const CLIENTS = [];
const CLIENTSWITHIDS = [];

const PORT = process.env.PORT || 3001;

const app = express();


//note sure why needed . cant remmeber now 
// app.use(function(req, res, next) {
//   if(req.headers['x-forwarded-proto']==='http') {
//     return res.redirect(['https://', req.get('Host'), req.url].join(''));
//   }
//   next();
// });

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

// app.listen(PORT, () => {
//   console.log(`Server listening on ${PORT}`);
// });

sslSrv = http.createServer(app).listen(process.env.PORT || 3001);
console.log("The HTTPS server is up and running");

wss = new WebSocketServer({ server: sslSrv });
console.log("WebSocket Secure server is up and running.");


wss.on('connection', function (client) {
  CLIENTS.push(client);
  console.log("A new WebSocket client was connected.");
  /** incomming message */
  client.on('message', function (message) {
    /** broadcast message to all clients */
    console.log("Recieved Message");
    console.log(message);
    let messageObj = JSON.parse(message);
    if (messageObj.action == "ClientRegistration") {
      console.log("Regsistering new client");
      CLIENTSWITHIDS.push({ ID: messageObj.body.ID, client: client });
    }
    else if (messageObj.action = "SendMessage") {
      wss.broadcastToOne(messageObj, client);
    }
    // wss.broadcast(message, client);
  });
});

wss.on('error', function (err) {

  console.log(err)
});





wss.broadcastToOne = function (data, exclude) {
  var i = 0, n = CLIENTSWITHIDS.length, client = null;
  if (n < 1) return;
  console.log("Client list has " + n + " WebSocket clients.");
  console.log(JSON.stringify(CLIENTSWITHIDS))
  for (; i < n; i++) {
    clientObj = CLIENTSWITHIDS[i];

    // don't send the message to the sender...
    //if (client.client === exclude) continue;
    if (clientObj.ID == data.body.ID) {
      if (clientObj.client != null) {
        console.log("client is " + JSON.stringify(clientObj.client));
        if (clientObj.client.readyState === clientObj.client.OPEN) {
          clientObj.client.send(JSON.stringify(data));
        }
        else {
          console.error('Error: the client state is not open')
        }
      }
      else {
        console.error("clientObj.client  is null");
      }
    }
  }
};



// // broadcasting the message to all WebSocket clients.
// wss.broadcast = function (data, exclude) {
//   var i = 0, n = CLIENTS.length , client = null;
//   if (n < 1) return;
//   console.log("Broadcasting message to all " + n + " WebSocket clients.");
//   for (; i < n; i++) {
//     client = CLIENTS[i];
//     // don't send the message to the sender...
//     if (client === exclude) continue;
//     if (client.readyState === client.OPEN) client.send(data);
//     else console.error('Error: the client state is ' + client.readyState);
//   }
// };