var mongoose = require('mongoose')

var Schema = mongoose.Schema

var userSchema = new Schema({
  subscription: [{
    stamp: { type: String, required: true },
    data: {
      endpoint: { type: String, required: true },
      auth: { type: String, required: true },
      p256dh: { type: String, required: true }
    }
  }],
  userId: { type: String, required: true },
  scope: [{ type: String, required: true }],
  name: { type: String, required: true },
}, {
    timestamps: true
  })

var User = mongoose.model('User', userSchema)
module.exports = User