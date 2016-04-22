var WebSocketServer = require('ws').Server;
var https = require ('https');
var express = require('express');
var fs = require('fs');
const options = {
  key: fs.readFileSync('/home/ubuntu/www.thegeekstuff.com.key'),
  cert: fs.readFileSync('/home/ubuntu/www.thegeekstuff.com.crt')
};
var Application = express();
var port = 3434;
var Server = https.createServer(options, Application);

var wss = new  WebSocketServer({
  server: Server
});

wss.broadcast = function(data) {
    for(var i in this.clients) {
        this.clients[i].send(data);
    }
};

wss.on('connection', function(ws) {
    ws.on('message', function(message) {
        console.log('received: %s', JSON.stringify(message));
        wss.broadcast(message);
    });
});

Server.listen(port, function () { console.log('Listening on ' + Server.address().port) });
