var express = require('express');
var router = express.Router();
var userController = require('../controllers/user.js')

/* GET users listing. */
router.get('/me', userController.me);
router.get('/rooms', userController.rooms);
router.post('/register', userController.register)

module.exports = router;
