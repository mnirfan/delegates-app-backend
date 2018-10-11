process.env.NODE_ENV = 'test'


const { readFileSync } = require("fs")
let axios = require('axios')
let mongoose = require('mongoose')
let Events = require('../models/Event')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')
let should = chai.should()

// let token = process.env.TEST_TOKEN
let token = ''
var createdEvent

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
    console.error("Can't connect to auth server localhost:3002")
  })
})

describe('Event', () => {

  // clear databse each testing
  before((done) => {
    Events.deleteMany({}).then(() => {
      done()
    })
  })

  describe('Get empty events', () => {
    it('should get empty events', (done) => {
      chai.request(server)
      .get('/api/event/')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('array')
        res.body.length.should.be.eql(0);
        done()
      })
    })
  })

  describe('Create new event', () => {

    it('should create new event', (done) => {
      chai.request(server)
      .post('/api/event/create')
      .set('Authorization', 'Bearer ' + token)
      .field('title', 'test-1')
      .field('dresscode', 'bebas')
      .field('timeStart', '1539154800')
      .field('timeEnd', '1539158400')
      .field('location', 'D.5.4')
      .field('description', 'deskripsi')
      .attach('image', readFileSync('test/image_test.png'), 'image_test.png')
      .end((err, res) => {
        createdEvent = res.body
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('title').that.is.equal('test-1')
        done()
      })
    })
  })

  describe('Get all events', () => {
    it('should get all events', (done) => {
      chai.request(server)
      .get('/api/event/')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('array')
        res.body.length.should.be.eql(1)
        done()
      })
    })
  })

  describe('Get an event detail', () => {
    it('should get detail of created event', (done) => {
      chai.request(server)
      .get('/api/event/' + createdEvent._id)
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('title', 'test-1')
        done()
      })
    })
  })

  describe('Update an event', () => {
    it('should update an event', (done) => {
      chai.request(server)
      .post('/api/event/update')
      .set('Authorization', 'Bearer ' + token)
      .field('id', createdEvent._id)
      .field('title', 'test-1')
      .field('dresscode', 'resmi')
      .field('timeStart', '1539154800')
      .field('timeEnd', '1539158400')
      .field('location', 'D.5.4')
      .field('description', 'deskripsi')
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('dresscode', 'resmi')
        done()
      })
    })
  })

  describe('Delete an event', () => {
    it('should delete an event', (done) => {
      chai.request(server)
      .delete('/api/event/delete')
      .set('Authorization', 'Bearer ' + token)
      .send({id: createdEvent._id})
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.equal('terhapus')
        done()
      })
    })
  })
})