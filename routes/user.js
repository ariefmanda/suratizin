const Model       = require('../models')
const message     = require('../helpers/message')
const library     = require('../helpers/library')
const template    = require('../helpers/templateemail')
const send        = require('../helpers/notification')
const express     = require('express')
const multer      = require('multer')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'User'

let objAlert  = null

Router.get('/:id', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(req.params.id)
    .then(function(user) {
      res.render('./login', {
        title       : title,
        setting     : setting[0],
        user        : user,
        alert       : objAlert,
        library     : library,
      })
      objAlert = null
    })
  })
})

Router.get('/:id/logout', (req, res) => {
  req.session.isLogin    = false
  req.session.destroy((err) => {
    if (!err) {
      res.locals.user        = null
      res.locals.userSession = null
      res.redirect('/')
    }
  })
})

Router.get('/profile/:id', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(req.params.id)
    .then(function(user) {
      res.render('./profile', {
        title       : title + ' Profile',
        setting     : setting[0],
        user        : user,
        userSession : req.session.user,
        alert       : objAlert,
        library     : library,
      })
      objAlert = null
    })
  })
})

Router.post('/upload/:id', (req, res) => {
  Model.User.findOne({
    where: {id: req.params.id},
  })
  .then(function(user) {
    const fileName = 'photo_' + Date.now() + '_'
    const Storage = multer.diskStorage({
      destination: function(req, file, callback) {
        callback(null, "./public/uploads/profile/");
      },
      filename: function(req, file, callback) {
        callback(null, fileName + file.originalname.split(' ').join('_').toLowerCase());
      }
    });

    var upload = multer({ storage: Storage }).single('photo_profile')
    upload(req, res, function(err) {
      if (!err) {
        let objProfile = {
          photo     : fileName + req.file.originalname.split(' ').join('_').toLowerCase(),
          updatedAt : new Date(),
        }
        Model.User.update(objProfile, {
          where: {
            id: user.id,
          }
        })
        .then(function() {
          req.session.user   = user
          res.locals.session = req.session
          objAlert = message.success()
          res.redirect(`/user/profile/${user.id}`)
        })
        .catch(function(err) {
          objAlert = message.error(err.message)
          res.redirect(`/user/profile/${user.id}`)
        })
      } else {
        objAlert = message.error(err.message)
        res.redirect(`/user/profile/${user.id}`)
      }
    })
  })
})

Router.post('/profile/edit/:id', (req, res) => {
  if (req.body.new_password != '') {
    if (req.body.new_password != req.body.new_password_repeat) {
      objAlert = message.error('Incorrect your repeat new password !!')
      res.redirect(`/user/profile/${req.params.id}`)
    }
  }

  var hooks = true
  if (req.body.new_password == '') {
    hooks = false
    var objUser = {
      name          : req.body.name,
      gender        : req.body.gender,
      handphone     : req.body.handphone,
      address       : req.body.address,
      updatedAt     : new Date(),
    }
  } else {
    var objUser = {
      name          : req.body.name,
      gender        : req.body.gender,
      handphone     : req.body.handphone,
      address       : req.body.address,
      password      : req.body.new_password,
      updatedAt     : new Date(),
    }
  }
  Model.User.update(objUser, {
    where: {
      id: req.params.id,
    },
    individualHooks: hooks,
  })
  .then(function() {
    objAlert = message.success()
    res.redirect(`/user/profile/${req.params.id}`)
  })
  .catch(function(err) {
    objAlert = message.error(err.message)
    res.redirect(`/user/profile/${req.params.id}`)
  })
})

module.exports = Router;
