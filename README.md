# WebRTCVideoCall

peer to peer video call

1. Server : WebSocket Server (Simple websocket sever over https)
2. Client : To Establish connection between two sessions.

Deploy
-------------
```sh
Server
------
cd server
npm install
node server.js

Client
cd client
npm install
node app.js
````

WebRTC Peer to peer Connect
---------------------------

Major Component
```sh
1. getUserMedia : Gets the local stream
    navigator.getUserMedia(constraints, getUserMediaSuccess, errorHandler);
2. RTCPeerConnection : Creates a peer connection with STUN and TURN Servers.
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
3. To Establish a conection user1 creates offer and sends to user2.
    peerConnection.createOffer(gotDescription, errorHandler);
4. User2 accepts offer and creates answer
    peerConnection.createAnswer(gotDescription, errorHandler);
5. Once ice candiate and SDP offer and answer exchange. connection will be established. 
```
