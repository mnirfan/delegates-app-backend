process.env.NODE_ENV = 'test'


const { readFileSync } = require("fs")
let axios = require('axios')
let mongoose = require('mongoose')
let Announcement = require('../models/Announcement')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')
let should = chai.should()

// let token = process.env.TEST_TOKEN
let token = ''
var createdAnnouncement

chai.use(chaiHttp)

before((done) => {
  axios({
    method: 'post',
    url: 'http://localhost:3002/api/auth/login',
    data: {
      email: 'irfanlongstride@gmail.com',
      password: 'supersecret'
    }
  }).then((response) => {
    token = response.data.token
    done()
  }).catch((error) => {
    console.error(error)
  })
})

describe('Announcement', () => {

  // clear databse each testing
  before((done) => {
    Announcement.deleteMany({}).then(() => {
      done()
    })
  })

  describe('Get empty announcement', () => {
    it('should get empty announcement', (done) => {
      chai.request(server)
      .get('/api/announcement/')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('array')
        res.body.length.should.be.eql(0);
        done()
      })
    })
  })

  describe('Create new announcement', () => {
    it('should create new announcement', (done) => {
      chai.request(server)
      .post('/api/announcement/create')
      .set('Authorization', 'Bearer ' + token)
      .field('title', 'test-1')
      .field('content', 'halo content')
      .field('scope', 'all')
      .attach('images', readFileSync('test/image_test.png'), 'image_test.png')
      .end((err, res) => {
        createdAnnouncement = res.body
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('title').that.is.equal('test-1')
        done()
      })
    })
  })

  describe('Get all announcements', () => {
    it('should get all announcements', (done) => {
      chai.request(server)
      .get('/api/announcement/')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('array')
        res.body.length.should.be.eql(1)
        done()
      })
    })
  })

  describe('Get an announcement detail', () => {
    it('should get detail of created announcement', (done) => {
      chai.request(server)
      .get('/api/announcement/' + createdAnnouncement._id)
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('title', 'test-1')
        done()
      })
    })
  })
})