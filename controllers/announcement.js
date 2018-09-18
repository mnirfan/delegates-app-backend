var fs = require('fs')
var axios = require('axios')
var Announcement = require('../models/Announcement')
var User = require('../models/User')
var webPush = require('web-push')

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
          endpoint: sub.endpoint,
          keys: {
            auth: sub.auth,
            p256dh: sub.p256dh
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
      var images = await req.files.map(file => {
        return '/api/static/uploads/'+file.filename
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
          url: `/announcement/${announcement._id}`,
          title: 'Pengumuman Baru',
          content: announcement.title,
          scope: announcement.scope
        }
        var result = await sendPush(pushData)
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
      var annc = await Announcement.find({}, null, {sort: '-createdAt'})
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