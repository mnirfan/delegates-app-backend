var express = require('express');
var multer = require('multer');
var router = express.Router();
var classController = require('../controllers/class')
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
})
var upload = multer({ storage })

router.get('/', classController.all);
router.post('/create', upload.single('image'), classController.create)
router.post('/attend', classController.attend)
router.get('/registered', classController.registered);
router.post('/update', upload.single('image'), classController.update)
router.delete('/delete', classController.destroy)
router.get('/setting', classController.setting)
router.post('/toggle', classController.toggle)
router.get('/:id', classController.detail)
// router.post('/update', upload.single('image'), eventController.update)
// router.delete('/delete', eventController.destroy)
// router.get('/:id', eventController.detail)

module.exports = router;
