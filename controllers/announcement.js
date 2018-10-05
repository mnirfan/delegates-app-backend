var fs = require('fs')
var axios = require('axios')
var Announcement = require('../models/Announcement')
var User = require('../models/User')
var webPush = require('web-push')
var sharp = require('sharp')

async function sendPush(data, scope = 'all') {
  try {
    var users
    if (scope === 'all') {
      users = await User.find({})
    }
    else {
      users = await User.find({ scope })
    }
    var subscriptions = []
     users.forEach(user => {
      var userSubs = user.subscription.map(sub => {
        return {
          endpoint: sub.data.endpoint,
          keys: {
            auth: sub.data.auth,
            p256dh: sub.data.p256dh
          }
        }
      })
      subscriptions = [...subscriptions, ...userSubs]
    })
    // console.log(subscriptions);
    
    subscriptions.forEach(sub => {
      console.log(sub);
      
      webPush.sendNotification(sub, JSON.stringify(data))
    })
    return 'success'
  } catch (error) {
    throw error
  }
}

module.exports = {
  create: async function (req, res) {
    console.log(req.body, req.files);
    
    try {
      var images = []
      req.files.forEach(file => {
        images.push({
          original: '/api/static/uploads/hires/' + file.filename,
          thumbnail: '/api/static/uploads/thumbnails/' + file.filename
        })
        sharp(file.destination + '/' + file.filename)
          .resize(100, null)
          .toFile(file.destination + '/../thumbnails/' + file.filename)
      })
      var announcement = await Announcement.create({
        title: req.body.title,
        subtitle: req.body.subtitle,
        content: req.body.content,
        images: images,
        author: req.user.name,
        scope: req.body.scope
      })
      if (announcement) {
        var pushData = {
          url: `/announcement`,
          title: 'Pengumuman Baru',
          content: announcement.title,
          scope: announcement.scope
        }
        var result = await sendPush(pushData, announcement.scope)
        console.log(result);
        res.json(announcement)
      }
      else {
        res.status(500).json({ message: 'failed' })
      }
    }
    catch (error) {
      req.files.forEach(image => {
        fs.unlink(`public/uploads/${image.filename}`, (err) => {
          if (err) console.log(err.message);
        })
      })
      res.status(500).json({
        message: error.message
      })
    }
  },
  all: async function (req, res) {
    try {
      var scopes = req.user.roles.map(role => {
        var parts = role.split('_')
        return parts[2] ? parts[2].replace('-', ' ').toLowerCase() : ''
      })
      var roles = req.user.roles.map(role => {
        var parts = role.split('_')
        return parts[0] ? parts[0].toLowerCase() : ''
      })
      var annc = []
      console.log(roles);
      
      if (roles.indexOf('ranger') >= 0) {
        annc = await Announcement.find({}, 'title content scope createdAt', { sort: '-createdAt' })
      }
      else{
        annc = await Announcement.find({scope: {$in: ['all', ...scopes]}}, 'title content scope createdAt', {sort: '-createdAt'})
      }
      res.json(annc)
    } catch (error) {
      res.status(500).json(error.message)
    }
  },
  detail: async function (req, res) {
    try {
      var annc = await Announcement.findById(req.params.id)
      res.json(annc)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
}