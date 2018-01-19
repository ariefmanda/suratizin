const Model       = require('../models')
const message     = require('../helpers/message')
const library     = require('../helpers/library')
const template    = require('../helpers/templateemail')
const send        = require('../helpers/notification')
const express     = require('express')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'Log in / Register'

let objAlert  = null

Router.get('/', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    res.render('./login', {
      title     : title,
      setting   : setting[0],
      user      : null,
      alert     : objAlert,
    })
    objAlert = null
  })
})

Router.post('/add', (req, res) => {
  if (req.body.password != req.body.retype_password) {
    objAlert = message.error('Verifikasi password tidak sesuai dengan password !!')
    res.redirect('/login')
  } else {
    Model.Setting.findAll()
    .then(function(setting) {
      let info    = ''
      let token   = library.randomValueBase64(64)
      let link    = req.headers.host + '/activation/' + token
      let objUser = {
        name          : req.body.name,
        email         : req.body.email,
        password      : req.body.password,
        role          : req.body.role,
        reset_token   : token,
        reset_expired : null,
        status        : 0,
      }

      let promiseSendEmail = new Promise(function(resolve, reject) {
        let objMail = {
          to          : req.body.email,
          subject     : `[${setting[0].app_name}] Selamat ${req.body.name}, Akun Anda telah berhasil di daftarkan.`,
          body        : template.registered_success(setting[0], objUser, link),
        }
        send.email(objMail, function(error, info) {
          if (!error) {
            info = `Aktifasi akun telah dikirim ke email ${req.body.email}`
            console.log(info);
            resolve(info)
          } else {
            info = 'Gagal untuk mengirimkan aktifkasi akun !!'
            console.log(error);
            reject(error)
          }
        })
      })

      let promiseCreateUser = new Promise(function(resolve, reject) {
        Model.User.create(objUser)
        .then(function() {
          info = 'The record has been successfully updated.'
          resolve(info)
        })
        .catch(function(err) {
          message += err
          reject(err)
        })
      })

      Promise.all([promiseSendEmail, promiseCreateUser])
      .then(function() {
        Model.User.findOne({
          where: {
            email   : req.body.email,
            role    : req.body.role,
            status  : 0,
          }
        })
        .then(function(user) {
          objAlert = message.success(info)
          res.redirect(`/login/register/${user.id}`)
        })
      })
      .catch(function(err) {
        objAlert = message.error(err)
        res.redirect('/login')
      })
    })
  }
})

Router.get('/register/:id', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(req.params.id)
    .then(function(user) {
      res.render('./login', {
        title     : title,
        setting   : setting[0],
        user      : user,
        alert     : objAlert,
      })
      objAlert = null
    })
  })
})

Router.post('/verification', (req, res) => {
  Model.User.findOne({
    where: {
      username: req.body.username,
    }
  })
  .then((user) => {
    if (user == null) {
      message_login = 'Incorrect Username or Password !!'
      res.redirect('/login')
    } else {
      user.check_password(req.body.password, (isMatch) => {
        if (isMatch) {
          req.session.isLogin = true
          req.session.user = user
          let objLog = {
            UserId      : user.id,
            username    : user.username,
            ip_address  : getClientIp(req),
            last_login  : Date.now(),
            status      : 'success',
          }
          Model.Log.create(objLog)
          res.redirect('/')
        } else {
          req.session.isLogin = false //>>> ganti false
          req.session.user = undefined //>> ganti undefines
          message_login = 'Incorrect Username or Password !!'
          let objLog = {
            UserId      : user.id,
            username    : user.username,
            ip_address  : getClientIp(req),
            last_login  : Date.now(),
            status      : 'danger',
            information : message_login,
          }
          Model.Log.create(objLog)
          res.redirect('/login')
        }
      })
    }
  })
  .catch((err) => {
    message_login = err.message
    res.redirect('/login')
  })
})

module.exports = Router;
