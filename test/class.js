process.env.NODE_ENV = 'test'


const { readFileSync } = require("fs")
let axios = require('axios')
let mongoose = require('mongoose')
let Classes = require('../models/Class')
let Setting = require('../models/Setting')

let chai = require('chai')
let chaiHttp = require('chai-http')
let server = require('../app')
let should = chai.should()

// let token = process.env.TEST_TOKEN
let token = ''
let rangerToken = ''
var createdClass

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
    rangerToken = response.data.token
    done()
  }).catch((error) => {
    console.error(error)
  })
})

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

describe('Parallel Class', () => {

  // clear databse each testing
  before((done) => {
    Classes.deleteMany({}).then(() => {
      done()
    })
  })
  before((done) => {
    Setting.deleteMany({}).then(() => {
      done()
    })
  })

  describe('Get empty class', () => {
    it('should get empty class', (done) => {
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

  describe('Create new class', () => {
    it('should create new class', (done) => {
      chai.request(server)
        .post('/api/class/create')
        .set('Authorization', 'Bearer ' + token)
        .field('name', 'test-1')
        .field('description', 'deskripsi')
        .field('location', 'D.5.4')
        .field('panelist', 'nurul')
        .field('max', 5)
        .attach('image', readFileSync('test/image_test.png'), 'image_test.png')
        .end((err, res) => {
          createdClass = res.body
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('name').that.is.equal('test-1')
          done()
        })
    })
  })

  describe('Get all class', () => {
    it('should get all class', (done) => {
      chai.request(server)
        .get('/api/class/')
        .set('Authorization', 'Bearer ' + token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('array')
          res.body.length.should.be.eql(1)
          done()
        })
    })
  })

  describe('Get a class detail', () => {
    it('should get detail of created class', (done) => {
      chai.request(server)
        .get('/api/class/' + createdClass._id)
        .set('Authorization', 'Bearer ' + token)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('name', 'test-1')
          done()
        })
    })
  })

  describe('Update a class', () => {
    it('should update a class', (done) => {
      chai.request(server)
        .post('/api/class/update')
        .set('Authorization', 'Bearer ' + token)
        .field('id', createdClass._id)
        .field('name', 'test-2')
        .field('description', 'deskripsi')
        .field('location', 'D.5.4')
        .field('panelist', 'nurul')
        .field('max', 1)
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.an('object')
          res.body.should.have.property('name', 'test-2')
          res.body.should.have.property('max', 1)
          done()
        })
    })
  })

  describe('Get class registration status', () => {
    it('should get class registration status', (done) => {
      chai.request(server)
      .get('/api/class/setting')
      .set('Authorization', 'Bearer ' + token)
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('value', false)
        done()
      })
    })
  })

  describe('Open class registration', () => {
    it('should open class registration', (done) => {
      chai.request(server)
      .post('/api/class/toggle')
      .set('Authorization', 'Bearer ' + token)
      .send({isOpen: true})
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.be.an('object')
        res.body.should.have.property('value', true)
        done()
      })
    })
  })
  
  describe('Register to a class', () => {
    it('should registered to a class', (done) => {
      chai.request(server)
      .post('/api/class/attend')
      .set('Authorization', 'Bearer ' + token)
      .send({
        classId: createdClass._id
      })
      .end((err, res) => {
        res.should.have.status(200)
        res.body.should.equal('Berhasil masuk kelas')
        done()
      })
    })
    it('should not registered to a class because of already full', (done) => {
      chai.request(server)
      .post('/api/class/attend')
      .set('Authorization', 'Bearer ' + rangerToken)
      .send({
        classId: createdClass._id
      })
      .end((err, res) => {
        res.should.have.status(410)
        res.body.should.equal('full')
        done()
      })
    })
  })

  describe('Delete a class', () => {
    it('should delete a class', (done) => {
      chai.request(server)
        .delete('/api/class/delete')
        .set('Authorization', 'Bearer ' + token)
        .send({ id: createdClass._id })
        .end((err, res) => {
          res.should.have.status(200)
          res.body.should.be.equal('terhapus')
          done()
        })
    })
  })
})