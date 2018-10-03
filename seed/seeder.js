var seeder = require('mongoose-seed')
require('dotenv').config()

// Connect to MongoDB via Mongoose
seeder.connect(process.env.MONGODB_URL, function() {
  seeder.loadModels([
    'models/Setting.js'
  ])

  // Clear specified collections
  seeder.clearModels(['Setting'], function() {
    
    // Callback to populate DB once collections have been cleared
    seeder.populateModels(data, function() {
      seeder.disconnect()
    })
    
  })

  var data = [
    {
      model: 'Setting',
      documents: [
        {
          name: 'class-open',
          value: false
        },
        {
          name: 'rooms',
          value: [
            'education',
            'entrepreneur',
            'poverty',
            'urban planning',
            'human capital',
            'digital',
          ]
        }
      ]
    }
  ]
})
