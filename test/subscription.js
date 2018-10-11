process.env.NODE_ENV = 'test'

const { readFileSync } = require("fs")
let axios = require('axios')
let mongoose = require('mongoose')
let User = require('../models/User')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')
let should = chai.should()

// let token = process.env.TEST_TOKEN
let token = ''
var stamp = 'nurulirvan@gmail.com-31337'

chai.use(chaiHttp)

before((done) => {
  axios({
    method: 'post',
    url: 'http://localhost:3002/api/auth/login',
    data: {
      email: 'nurulirvan@gmail.com',
      password: 'SuperSecret'
    }
  }).then((response) => {
    token = response.data.token
    done()
  }).catch((error) => {
    console.error(error)
  })
})

describe('Subscription', () => {

  // clear databse each testing
  // before((done) => {
  //   User.deleteMany({}).then(() => {
  //     done()
  //   })
  // })

  describe('Get VAPID public key', () => {
    it('should get VAPID public key', (done) => {
      chai.request(server)
      .get('/vapidPublicKey/')
      .end((err, res) => {
        res.should.have.status(200)
        res.text.should.be.a('string')
        res.text.should.be.equal(process.env.PUSH_PUBLIC);
        done()
      })
    })
  })

  describe('Subscribe', () => {
    it('should create new subscription', (done) => {
      chai.request(server)
      .post('/api/subs/register')
      .set('Authorization', 'Bearer ' + token)
      .send({
        stamp,
        subscription: {
          endpoint: 'test-0',
          keys: {
            auth: 'test-1',
            p256dh: 'test-2'
          }
        }
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('message').that.is.equal('registered')
        done()
      })
    })
  })

  describe('Unsubscribe', () => {
    it('should remove a subscription', (done) => {
      chai.request(server)
        .post('/api/subs/unregister')
        .set('Authorization', 'Bearer ' + token)
        .send({
          stamp
        })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('message').that.is.equal('unregistered')
          done()
        })
    })
  })

})