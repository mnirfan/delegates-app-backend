var User = require('../models/User')
var Setting = require('../models/Setting')

module.exports = {
  me: async function(req, res) {
    try {
      if (!req.user) res.status(400).json('please login')
      var user = await User.findOne({ userId: req.user.sub }, 'userId scope')
      if (!user) res.json({})
      res.json(user)
    } catch (error) {
      res.status(500).json(error.message)
    }
  },
  register: async function(req, res) {
    try {
      var scopes = req.user.roles.map(role => {
        var parts = role.split('_')
        if (parts[2]){
          var scope = parts[2].replace('-', ' ')
          scope = scope.toLowerCase()
          return scope
        }
        else return null
      })
      scopes = scopes.filter(s => s)
      console.log(scopes);
      var user = await User.findOneAndUpdate({ userId: req.user.sub }, { userId: req.user.sub, $set: { scope: scopes }}, {new: true, upsert: true})
      res.json(user)
    } catch (error) {
      res.status(500).json(error.message)
    }
  },
  rooms: async function(req, res) {
    try {
      var rooms = await Setting.findOne({name: 'rooms'})
      res.json(rooms.value)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
}