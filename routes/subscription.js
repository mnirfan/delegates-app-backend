var express = require('express');
var router = express.Router();
var subscriptionController = require('../controllers/subscription')

router.get('/vapidPublicKey', subscriptionController.getVapidPublicKey);
router.post('/register', subscriptionController.register)
router.post('/unregister', subscriptionController.unregister)
router.post('/sendNotification', subscriptionController.sendNotification)

module.exports = router;
