var webPush = require('web-push')
var User = require('../models/User')

webPush.setVapidDetails(
  'https://serviceworke.rs/',
  process.env.PUSH_PUBLIC,
  process.env.PUSH_PRIVATE
);

module.exports = {
  getVapidPublicKey: function(req, res) {
    res.send(process.env.PUSH_PUBLIC)
  },

  register: async function(req, res) {
    console.log(req.body.subscription, req.user)
    try {
      var user = await User.findOne({ userId: req.user.sub })
      console.log(user);
      
      if (!user) user = await User.create({ userId: req.user.sub, scope: 'digital' })
      var subs = {
        endpoint: req.body.subscription.endpoint,
        auth: req.body.subscription.keys.auth,
        p256dh: req.body.subscription.keys.p256dh
      }
      user.subscription.push(subs)
      await user.save()
      res.json({
        message: 'registered'
      })
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  },

  sendNotification: function(req, res) {
    const subscription = {
      endpoint: req.body.endpoint,
      keys: {
        auth: req.body.auth,
        p256dh: req.body.p256dh
      }
    }
    const payload = 'Ehem'
    const option = {
      TTL: req.body.ttl
    }
    webPush.sendNotification(subscription, payload, option)
    .then(() => {
      res.sendStatus(201)
    })
    .catch(err => {
      res.sendStatus(500)
      console.log(err)
    })
  }
}