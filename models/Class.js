let mongoose = require('mongoose');

let ClassSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  location: { type: String, required: true },
  panelist: { type: String, required: true },
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User'}],
  max: { type: String, required: true },
  image: { type: String, required: true },
}, {
    timestamps: true
  });

module.exports = mongoose.model('Class', ClassSchema);