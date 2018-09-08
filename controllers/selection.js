var Selection = require('../models/Selection')
var Vote = require('../models/Vote')

module.exports = {
  createSelection: async function (req, res) {
    try {
      var selection = await Selection.create({
        subject: req.body.subject,
        items: req.body.items,
      })
      res.json(selection)
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  },
  updateSelection: async function (req, res) {
    try {
      var selection = await Selection.findById(req.body.id)
      if (selection.votes.length > 0) {
        res.status(400).json({
          message: 'Already voted. Editing is not allowed.'
        })
        return
      }
      selection.subject = req.body.subject
      selection.items = req.body.items
      await selection.save()
      res.json(selection)
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  },
  deleteSelection: async function (req, res) {
    try {
      var selection = await Selection.findById(req.body.id)
      if (selection) {
        selection.remove()
        res.json({ message: 'deleted' })
      }
      else {
        res.status(404).json({ message: 'not found' })
      }
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  },
  allSelection: async function (req, res) {
    try {
      var selections = await Selection.find({})
      res.json(selections)
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  },
  detailSelection: async function (req, res) {
    try {
      var selection = await Selection.findById(req.params.id).populate('votes')
      res.json(selection)
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  },
  vote: async function (req, res) {
    try {
      var selection = await Selection.findById(req.body.id)
      var userVote = await Vote.findOne({ user: req.user.sub, selection: selection._id })
      if (userVote) {
        res.status(400).json({
          message: 'Already voted'
        })
        return
      }
      var vote = await Vote.create({
        user: req.user.sub,
        selection: selection._id,
        votedItem: req.body.vote
      })
      selection.votes.push(vote._id)
      await selection.save()
      res.json(selection)
    } catch (error) {
      res.status(500).json({
        message: error.message
      })
    }
  }
}