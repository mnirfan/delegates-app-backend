var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/vapidPublicKey', function(req, res) {
  res.send(process.env.PUSH_PUBLIC)
});



module.exports = router;
