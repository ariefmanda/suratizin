const Model       = require('../models')
const message     = require('../helpers/message')
const express     = require('express')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'Register'

let objAlert  = null

Router.get('/:id', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.User.findById(req.params.id)
    .then(function(user) {
      res.render('./login', {
        title     : title,
        setting   : setting[0],
        alert     : objAlert,
        user      : user,
      })
      objAlert = null
    })
  })
})

module.exports = Router;
