const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
   userName: {
        type: String,
        minlength: 1
    }
})

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const User = mongoose.model('user', userSchema);
module.exports = User