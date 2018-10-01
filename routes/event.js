var express = require('express');
var multer = require('multer');
var router = express.Router();
var eventController = require('../controllers/event')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
var upload = multer({ storage })

router.get('/', eventController.all);
router.post('/create', upload.single('image'), eventController.create)
router.get('/now', eventController.now)
router.post('/update', upload.single('image'), eventController.update)
router.delete('/delete', eventController.destroy)
router.get('/:id', eventController.detail)

module.exports = router;
