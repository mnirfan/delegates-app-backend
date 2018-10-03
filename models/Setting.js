var mongoose = require('mongoose')

var Schema = mongoose.Schema

var settingSchema = new Schema({
  name: { type: String, required: true },
  value: Object
})

var Setting = mongoose.model('Setting', settingSchema)
module.exports = Setting