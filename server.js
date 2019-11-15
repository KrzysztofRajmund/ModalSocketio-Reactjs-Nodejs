const express = require('express')
const cors = require('cors')
const http = require('http')
const socketio = require('socket.io')


var app = express()


var server = http.createServer(app)
var io = socketio(server);

io.on('connection', socket =>{
    console.log('New Socket Connection', socket.id)
    socket.broadcast.emit('message', 'A new user connected!!!')

    socket.on('sendMessage', message =>
       io.emit('message', message));

    socket.on('disconnect',()=>{
        io.emit('message', 'A user disconnected');
    });

})

server.use(cors())
server.use(express.json())

port = 3000
server.listen(port,()=>{
    console.log('Server is on port', port)
})
