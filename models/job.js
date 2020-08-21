const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String
  },
  model: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true,
    minlength: 5
  },
  quote: {
    type: String
  },
  password: {
    type: String
  },
  status: {
    type: String,
    required: true
  },
  date: Date,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

jobSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Job', jobSchema)