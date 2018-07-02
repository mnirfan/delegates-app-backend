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
  time: {
    start: {
      required: true,
      type: String
    },
    end: {
      required: true,
      type: String
    },
  },
  date: {
    required: false,
    type: Date
  },
  location: {
    required: true,
    type: String
  },
  now: {
    required: true,
    type: Boolean,
    default: false
  },
})

var Event = mongoose.model('Event', eventSchema)
module.exports = Event