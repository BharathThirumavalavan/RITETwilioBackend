const mongoose = require('mongoose')

let userInfo = new mongoose.Schema({
  phoneNumber: {
    type: String,
    required: [true, 'Please Enter Number'],
  },
  userName: {
    type: String,
    default: 'Guest',
  },
  location: {
    type: Object,
    required: [true, 'Restriced access to location'],
  },
})

module.exports = mongoose.model('userDetails', userInfo)
