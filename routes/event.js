var express = require('express');
var multer = require('multer');
var router = express.Router();
var eventController = require('../controllers/event')
var upload = multer({ dest: 'public/images/' })

router.get('/', eventController.all);
router.get('/detail', eventController.detail)
router.post('/create', upload.single('image'), eventController.create)

module.exports = router;
