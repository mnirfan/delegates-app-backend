let mongoose = require('mongoose');

let announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  images: [{
    original: { type: String },
    thumbnail: { type: String }
  }],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  scope: { type: String, required: true, default: 'all' }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Announcement', announcementSchema);