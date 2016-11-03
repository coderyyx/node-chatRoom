/**
 * Created by yyx on 2016/11/3.
 */

function divEscapedContentElement(message){
    return $('<div></div>').text(message);
}

function divSystemContentElement(message){
    return $('<div></div>').html('<i>'+message+'<i>');
}

function precessUserInput(chatApp,socket){
    var message = $('#send-message').val();
    var systemMessage;
    if(message.charAt(0)=='/'){
        systemMessage=chatApp.precessCommand(message);
        if(systemMessage){
            $('#message').append(divSystemContentElement(systemMessage));
        }
    }else{
        chatApp.sendMessage($('#room').text(),message);
        $('#message').append(divEscapedContentElement(message));
    }
    $('#send-message').val('');
}

var socket=io.connect();
$(document).ready(function(){
    var chatApp=new Chat(socket);
    socket.on('nameResult',function(result){
        var message;
        if(result.message){
            message='You are known as '+ result.name+'.';
        }else{
            message=result.message;
        }
        $('#message').append(divSystemContentElement(message));
    })

    socket.on('joinResult',function(result){
        $('#room').text(result.room);
        $("#message").append(divSystemContentElement('Room changed.'));
    })

    socket.on('message',function(message){
        var newElement=$('<div></div>').text(message.text);
        $("#message").append(newElement);
    })

    socket.on('rooms',function(rooms){
        $('#room-list').empty();
        for(var room in rooms){
            room = room.substring(1,room.length);
            if(room!=''){
                $('#room-list').append(divEscapedContentElement(room));
            }
        }
        $('#room-list div').click(function(){
            chatApp.precessCommand('/join'+$(this).text());
            $('#send-message').focus();
        })
    })

    setInterval(function(){
        socket.emit('rooms');
    },1000);

    $('#send-message').focus();
    $('#send-form').submit(function(){
        precessUserInput((chatApp,socket));
        return false;
    })
})