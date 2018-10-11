var Class = require('../models/Class')
var User = require('../models/User')
var Setting = require('../models/Setting')
const print = console.log

module.exports = {
  all: async function(req, res) {
    try {
      var kelases = await Class.find({})
      res.json(kelases)
    } catch (error) {
      res.status(500).json(error.message)
    }
  },
  create: async function(req, res) {
    try {
      if (!req.file) {
        res.status(500).json('no image provided')
      }
      var kelas = await Class.create({
        name: req.body.name,
        image: '/api/static/uploads/' + req.file.filename,
        description: req.body.description,
        location: req.body.location,
        panelist: req.body.panelist,
        max: req.body.max
      })
      res.json(kelas)
    } catch (error) {
      res.status(500).json(error.message)
    }
  },
  detail: async function(req, res) {
    try {
      var kelas = await Class.findById(req.params.id)
      .populate('participants', '_id userId scope')
      res.json(kelas)
    } catch (error) {
      res.status(500).json(error.message)
    }
  },
  update: async function(req, res) {
    try {
      var kelas = await Class.findById(req.body.id)
      if (!kelas) {
        res.status(404).json('kelas tidak ditemukan')
        return
      }
      kelas.name = req.body.name
      if (req.file) kelas.image = '/api/static/uploads/' + req.file.filename
      kelas.max = req.body.max
      kelas.description = req.body.description
      kelas.location = req.body.location
      kelas.panelist = req.body.panelist
      await kelas.save()
      res.json(kelas)
    } catch (error) {
      res.status(500).json(error.message)
    }
  },
  destroy: async function(req, res) {
    try {
      var kelas = await Class.findById(req.body.id)
      if (!kelas) {
        res.status(404).json('kelas tidak ditemukan')
        return
      }
      await Class.deleteOne({_id: req.body.id})
      res.json('terhapus')
    } catch (error) {
      res.status(500).json(error.message)
    }
  },
  attend: async function(req, res) {
    try {
      var kelas = await Class.findById(req.body.classId)
      var user = await User.findOne({userId: req.user.sub})
      var isOpen = await Setting.findOne({name: 'class-open'})
      if (!kelas) {
        res.status(404).json('kelas tidak ditemukan')
        return
      }
      if (!user) {
        res.status(404).json('user tidak ditemukan')
        return
      }
      if (isOpen.value !== true) {
        res.status(410).json('not-open')
      }
      if (kelas.participants.indexOf(user._id) >= 0) {
        res.json('sudah pernah masuk')
        return
      }
      if (kelas.participants.length < kelas.max) {
        await Class.updateOne(
          { _id: req.body.classId }, 
          {$push: {participants: user._id}}
        )
        res.json('Berhasil masuk kelas')
      }
      else {
        res.status(410).json('full')
      }
    } catch (error) {
      res.status(500).json(error.message)
    }
  },
  setting: async function(req, res) {
    try {
      var classSetting = await Setting.findOne({name: 'class-open'})
      if (!classSetting) {
        classSetting = await Setting.create({ name: 'class-open', value: false })
      }
      res.json(classSetting)
    } catch (error) {
      res.status(500).json(error.message)
    }
  },
  toggle: async function(req, res) {
    try {
      var classSetting = await Setting.findOne({ name: 'class-open' })
      if (!classSetting) {
        classSetting = await Setting.create({name: 'class-open', value: false})
      }
      classSetting.set('value', req.body.isOpen)
      await classSetting.save()
      res.json(classSetting)
    } catch (error) {
      res.status(500).json(error.message)
    }
  }
}