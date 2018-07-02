var fs = require('fs')
var Event = require('../models/Event')

module.exports = {
  all: function(req, res) {
    Event.find({})
    .then(events => {
      res.json(events)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  },
  create: function(req, res) {
    if (req.file) {
      fs.renameSync(req.file.path, req.file.destination + req.body.title + '.png')

      Event.create({
        title: req.body.title,
        image: req.body.title + '.png',
        dresscode: req.body.dresscode,
        time: {
          start: req.body.timeStart,
          end: req.body.timeEnd
        },
        date: req.body.date,
        location: req.body.location,
        now: req.body.now
      })
        .then(event => {
          if (event) {
            res.json('created')
          }
          else {
            res.json('not created')
          }
        })
        .catch(err => {
          res.status(500).json(err)
        })
    }
  }
}