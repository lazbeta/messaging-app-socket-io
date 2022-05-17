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
    //console.log(socket.id)

    Room.find().then(result => {
        socket.emit('existingRooms', result)
    })

    socket.on('createRoom', name => {
        const room = new Room({name})
        room.save().then(room => {
        io.emit('roomCreated', room)
        })
    })

    socket.on('joinRoom', (roomId) => {
      socket.join(roomId, (err) => {
         if (err) {
             console.log('error')
             console.log(err, err.message)
         }})
    })

    socket.on('sendMessage', (message, roomId, callback) => {
        const messageToStore = {
            body: message,
            room: roomId
        }
        const msg = new Message(messageToStore)
        msg.save().then(message => {
            io.to(roomId).emit('message', message)
            callback()
            console.log(message)
        })
    })

    //get old messages by room id
     socket.on('getHistory', roomId => {
         const getId = Object.values(roomId)
         const id = getId[1]
        Message.find({room: id}).then(result => {
            socket.emit('oldMessages', result)
        })
    })

      // Leave the room if the user closes the socket
  socket.on("disconnect", roomId => {
    socket.leave(roomId)
  })


})
http.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`);
})
