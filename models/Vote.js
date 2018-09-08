let mongoose = require('mongoose');

let VoteSchema = new mongoose.Schema({
  user: { type: String, required: true },
  selection: { type: mongoose.Schema.Types.ObjectId, required: true },
  votedItem: { type: String, required: true },
}, {
    timestamps: true
  });

module.exports = mongoose.model('Vote', VoteSchema);