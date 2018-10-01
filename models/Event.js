var mongoose = require('mongoose')

var Schema = mongoose.Schema

var eventSchema = new Schema({
  title: {
    required: true,
    type: String
  },
  image: {
    required: true,
    type: String
  },
  dresscode: {
    required: true,
    type: String
  },
  start: {
    required: true,
    type: String
  },
  end: {
    required: true,
    type: String
  },
  location: {
    required: true,
    type: String
  },
  description: {
    type: String
  }
}, {
    timestamps: true
  }
)

var Event = mongoose.model('Event', eventSchema)
module.exports = Event