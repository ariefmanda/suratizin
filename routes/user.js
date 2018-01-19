const Model       = require('../models')
const message     = require('../helpers/message')
const library     = require('../helpers/library')
const template    = require('../helpers/templateemail')
const send        = require('../helpers/notification')
const express     = require('express')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'User'

let objAlert  = null

Router.get('/', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    res.render('./login', {
      title       : title,
      setting     : setting[0],
      user        : null,
      userSession : req.session.user,
      alert       : objAlert,
      library     : library,
    })
    objAlert = null
  })
})

Router.get('/logout', (req, res) => {
  req.session.isLogin    = false
  req.session.destroy((err) => {
    if (!err) {
      res.locals.user        = null
      res.locals.userSession = null
      res.redirect('/')
    }
  })
})

module.exports = Router;
