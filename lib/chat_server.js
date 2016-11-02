var socketio=require('socket.io');
var io;
var guestNumber=1;
var nickName={};
var namesUsed=[];
var currentRoom={};

exports.listen=function(server){
    io=socketio.listen(server);
    io.set('log level',1);
    io.sockets.on('connection',function(socket){
        guestNumber=assignGuestName(socket,guestNumber,nickName,namesUsed);
    })
}