let mongoose = require('mongoose');
let Vote = require('./Vote')

let selectionSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  items: [{ type: String }],
  votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Vote' }]
}, {
    timestamps: true
  });

selectionSchema.pre('remove', function (next) {
  Vote.remove({ selection: this._id }).exec()
  next()
})

module.exports = mongoose.model('Selection', selectionSchema);