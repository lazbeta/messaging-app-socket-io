const mongoose = require('mongoose')

const messageSchema = mongoose.Schema({
   body: {
        type: String,
        minlength: 1
    },
    room: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'room'
    }]
})

messageSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const Message = mongoose.model('message', messageSchema);
module.exports = Message