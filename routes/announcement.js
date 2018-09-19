var express = require('express');
var multer = require('multer');
var router = express.Router();
var announcementController = require('../controllers/announcement')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/hires')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
var upload = multer({ storage })

// router.get('/', announcementController.all);
// router.get('/detail', announcementController.detail)
router.post('/create', upload.array('images', 5), announcementController.create)
router.get('/', announcementController.all)
router.get('/:id', announcementController.detail)

module.exports = router;