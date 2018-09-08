var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = new Schema({
  subscription: [{
    endpoint: {type: String, required: true},
    auth: { type: String, required: true },
    p256dh: { type: String, required: true }
  }],
  userId: { type: String, required: true },
  scope: { type: String, required: true },
})

var User = mongoose.model('User', userSchema)
module.exports = User