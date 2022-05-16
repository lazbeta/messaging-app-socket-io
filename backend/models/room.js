const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: 2
    },
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages'
    }]
})


roomSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Room = mongoose.model('room', roomSchema);
module.exports = Room