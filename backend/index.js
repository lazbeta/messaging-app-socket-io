const express = require('express');
const app = express()
const cors = require('cors');
const corsOptions = {
            origin: 'http://localhost:3000',
            credentials: true,
            optionsSuccessStatus: 200 
}   

const http = require('http').createServer(app)

const mongoose = require('mongoose')
const socketio = require('socket.io')

const io = socketio(http,{
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"]
    }
})

require('dotenv').config()

const mongoDB = process.env.MONGODB_URI 
const PORT = process.env.PORT || 4000
app.use(cors(corsOptions))
app.use(express.json())

const Room = require('./models/room')
const Message = require('./models/message');

mongoose.connect(mongoDB, 
{useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log('connected'))
.catch(err => console.log(err))

io.on('connection', (socket) => {
    Room.find().then(result => {
        socket.emit('existing-rooms', result)
    })

    socket.on('create-room', name => {
        const room = new Room({ name })
        room.save().then(result => {
        io.emit('room-created', result)
        })
    })

    socket.on('joinRoom', (room_id) => {
      socket.join(room_id, (err) => {
         if (err) {
             console.log('error')
             console.log(err, err.message)
         }})
    })

    socket.on('sendMessage', (message, room_id, callback) => {
        const messageToStore = {
            body: message,
            room: room_id
        }

        const msg = new Message(messageToStore)

        msg.save().then(message => {
            io.to(room_id).emit('message', {message, room: room_id})
            callback()

        Message.find( {room_id} ).then(result => {
            io.emit('oldMessages', result)
        })

        })
    
    // Leave the room if the user closes the socket
    socket.on("disconnect", () => {
    socket.leave(room_id)
  })
    })
    
})
http.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
})
