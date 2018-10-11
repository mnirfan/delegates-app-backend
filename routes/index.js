var express = require('express');
var webPush = require('web-push')
var router = express.Router();

/* GET home page. */
router.get('/vapidPublicKey', function(req, res) {
  res.send(process.env.PUSH_PUBLIC)
});

router.post('/test-push', function (req, res) {
  console.log(req.body);
  const subscription = {
    endpoint: req.body.endpoint,
    keys: {
      auth: req.body.keys.auth,
      p256dh: req.body.keys.p256dh
    }
  }
  var pushData = {
    url: `/announcement`,
    title: 'Pengumuman Baru',
    content: 'Sukses testing'
  }

  webPush.sendNotification(subscription, JSON.stringify(pushData))
  .then(() => {
    res.sendStatus(201)
  })
  .catch(err => {
    res.sendStatus(500)
    console.log(err)
  })
})



module.exports = router;
