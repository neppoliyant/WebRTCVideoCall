var localVideo;
var remoteVideo;
var peerConnection;
var peerConnectionConfig = {'iceServers': [{'url': 'stun:stun.services.mozilla.com'}, {'url': 'stun:stun.l.google.com:19302'}]};

navigator.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia || navigator.webkitGetUserMedia;
window.RTCPeerConnection = window.RTCPeerConnection || window.mozRTCPeerConnection || window.webkitRTCPeerConnection;
window.RTCIceCandidate = window.RTCIceCandidate || window.mozRTCIceCandidate || window.webkitRTCIceCandidate;
window.RTCSessionDescription = window.RTCSessionDescription || window.mozRTCSessionDescription || window.webkitRTCSessionDescription;

function pageOnReady() {
    serverConnection = new WebSocket('wss://10.36.110.184:3434');
    //OnMessage event trigger gotMessageFromServer() will be executed.
    serverConnection.onmessage = gotMessageFromServer;

    var constraints = {
        video: true,
        audio: true,
    };

    if(navigator.getUserMedia) {
    	navigator.getUserMedia(constraints, getUserMediaOnSuccess, errorHandler);
    } else {
        alert('Your browser does not support WebRTC');
    }
}

function getUserMediaOnSuccess(stream) {
    localStream = stream;
    var localVideo = document.getElementById('localVideo');
    localVideo.src = window.URL.createObjectURL(localStream);
}

function start(isCaller) {
    peerConnection = new RTCPeerConnection(peerConnectionConfig);
    
  //OnIceCandidate, OnAddStream, respect event trigger the respective callback methods will be executed. All these triggers will be invoked by WebRTC stack.
    
    peerConnection.onicecandidate = gotIceCandidate;
    peerConnection.onaddstream = gotRemoteStream;
    peerConnection.addStream(localStream);

    if (isCaller) {
        peerConnection.createOffer(gotOfferSDP, errorHandler);
    }    
}

//As in when WebRTC stack returns SDP this function will be executed.
function gotOfferSDP(offer) {
    console.log('got offer');
    peerConnection.setLocalDescription(offer, function () {
        serverConnection.send(JSON.stringify({'sdp': offer}));
    }, function() {console.log('set offer description error')});
}

//As in when WebRTC stack returns SDP this function will be executed.
function gotAnswerSDP(answer) {
    console.log('got answer');
    peerConnection.setLocalDescription(answer, function () {
        serverConnection.send(JSON.stringify({'sdp': answer}));
    }, function() {console.log('set answer description error')});
}

//As in when WebSocket triggers OnMessage event this method will be executed.
function gotMessageFromServer(message) {
	//if not a peerConnection object then start(false);
    if(!peerConnection) {
    	start(false);
    }    	
  
    var signal = JSON.parse(message.data);
    if(signal.sdp) {
        peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp), function() {
            console.log("success creation of session description");
            peerConnection.createAnswer(gotAnswerSDP, errorHandler);
        }, errorHandler);
    } else if(signal.ice) {
        peerConnection.addIceCandidate(new RTCIceCandidate(signal.ice));
    }
}

//As in when WebRTC stack returns IceCandidates this function will be executed.
function gotIceCandidate(event) {
    if(event.candidate != null) {
        serverConnection.send(JSON.stringify({'ice': event.candidate}));
    }
}


//As in when WebRTC stack returns remoteStream this function will be executed.
function gotRemoteStream(event) {
    var remoteVideo = document.getElementById('remoteVideo');
    console.log('got remote stream');
    remoteVideo.src = window.URL.createObjectURL(event.stream);
}

function errorHandler(error) {
    console.log(error);
}
