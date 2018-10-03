var fs = require('fs')
var dayjs = require('dayjs')
var isBetween = require('dayjs/plugin/isBetween')
dayjs.extend(isBetween)
var Event = require('../models/Event')

module.exports = {
  all: function(req, res) {
    Event.find({}, null, { sort: 'start' })
    .then(events => {
      res.json(events)
    })
    .catch(err => {
      res.status(500).json(err.message)
    })
  },
  now: function(req, res) {
    Event.find({}, 'title image dresscode start end location', { sort: 'start' })
    .then(events => {
      var nowIndex = null
      var now = null
      var next = null
      events.forEach((event, index, array) => {
        
        if (dayjs(new Date()).isBetween(dayjs(event.start * 1000), dayjs(event.end * 1000))) {
          nowIndex = index
        }
      })
      if(nowIndex !== null) {
        now = events[nowIndex]
        next = events[nowIndex + 1] || null
      }
      res.json({now, next})
    })
    .catch(err => {
      res.status(500).json(err.message)
    })
  },
  create: function(req, res) {
    if (req.file) {
      Event.create({
        title: req.body.title,
        image: '/api/static/uploads/' + req.file.filename,
        dresscode: req.body.dresscode,
        start: req.body.timeStart,
        end: req.body.timeEnd,
        date: req.body.date,
        location: req.body.location,
        description: req.body.description
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
        res.status(500).json({
          message: err.message
        })
      })
    }
    else {
      res.status(500).json({
        message: 'no image provided'
      })
    }
  },
  detail: function(req, res) {
    Event.findById(req.params.id)
    .then(event => {
      res.json(event)
    })
    .catch(err => {
      res.status(500).json(err)
    })
  },
  update: function(req, res) {
    Event.findById(req.body.id)
    .then(event => {
      if(event) {
        if (req.file) {
          console.log(req.file);
          
          var oldImage = event.image.split('/api/static/')[1]
          event.image = '/api/static/uploads/' + req.file.filename
        }
        event.title = req.body.title
        event.dresscode = req.body.dresscode
        event.start = req.body.timeStart
        event.end = req.body.timeEnd
        event.location = req.body.location
        event.description = req.body.description
        event.save().then(() => {
          if (req.file) fs.unlinkSync('public/' + oldImage)
          res.json(event)
        }).catch(err => {
          res.status(500).json({ message: err.message })
        })
      }
      else {
        res.status(404).json({ message: 'not found' })
      }
    })
    .catch(err => {
      res.status(500).json({ message: err.message })
    })
  },
  destroy: function(req, res) {
    Event.findById(req.body.id)
    .then(event => {
      if (event) {
        var image = event.image.split('/api/static/')[1]
        Event.deleteOne({_id: req.body.id})
        .then(() => {
          res.json('terhapus')
          fs.unlinkSync('public/' + image)
        })
        .catch(error => {
          res.status(500).json(err.message)
        })
      }
      else {
        res.status(404).json('tidak ditemukan')
      }
    })
    .catch(error => {
      res.status(500).json(err.message)
    })
  }
}