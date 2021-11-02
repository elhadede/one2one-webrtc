var app = require('express')();
var http = require('http').Server(app);
const io = require('socket.io')(http, {
    cors: {
      origin: '*',
    }
  });
const port = process.env.PORT || 9000;

io.on('connection', socket => {
    socket.on("join-room", roomID => {
        let clients = io.sockets.adapter.rooms.get(roomID);
        let numClients = clients ? clients.size : 0;
        if (numClients < 2)
        {
            socket.join(roomID);
            socket.emit("joined");
            if(numClients > 0){
                io.to(roomID).emit("ack");
            }
        }else{
            socket.emit("full");
            return;
        }
    });
    socket.on("startConnection", () => {
        socket.to("test").broadcast.emit("startConnection");
        console.log("working");
    });
    socket.on("signal", (data) => {
       socket.to("test").broadcast.emit("signal", data);
    });
    socket.on('disconnecting', () => {
        let roomlist = Array.from(socket.rooms).filter(item => item!=socket.id);
        roomlist.forEach(function (item, index) {
            io.to(item).emit("leave");
            socket.leave(item);
        });
    });

});
http.listen(port, function() {
    console.log(`listening on localhost:${port}`);
});
app.listen()