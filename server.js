var  http=require('http');
var path=require('path');
var fs=require('fs');
var mime=require('mime');
var cache={};

function send404(response){
    response.writeHead(404,{'Content-Type':'text/plain'});
    response.write('404 Not Found');
    response.end();
}

function sendFile(response,filepath,fileContents){
    response.writeHead(200,{'Content-Type':mime.lookup(path.basename(filepath))});
    response.end(fileContents);
}

function serverStatic(response,cache,abspath){
    if(cache[abspath]){
        sendFile(response,abspath,cache[abspath]);
    }else{
        fs.exists(abspath,function(exists){
            if(exists){
                fs.readFile(abspath,function(err,data){
                    if(err){
                        send404(response);
                    }else{
                        cache[abspath];
                        sendFile(response,abspath,data);
                    }
                })
            }else{
                send404(response);
            }
        })
    }
}

var server=http.createServer(function(request,response){
    var filepath=false;
    if(request.url=='/'){
        filepath='public/index.html';
    }else{
        filepath='public'+request.url;
    }
    var abspath='./'+filepath;
    serverStatic(response,cache,abspath);
})

server.listen(8081,function(){
    console.log('server start...');
})