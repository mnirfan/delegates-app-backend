let mongoose = require('mongoose');

let announcementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subtitle: { type: String },
  content: { type: String, required: true },
  images: [{ type: String }],
  author: { type: String, required: true },
  scope: { type: String, required: true, default: 'all' }
}, {
    timestamps: true
  });

module.exports = mongoose.model('Announcement', announcementSchema);