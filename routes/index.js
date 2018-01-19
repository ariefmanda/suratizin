const Model   = require('../models')
const express = require('express')
const Router  = express.Router()
const title   = 'Home'

let objAlert  = null

Router.get('/', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    res.render('./index', {
      title       : title,
      action      : '',
      new_button  : false,
      alert       : objAlert,
      setting     : setting[0],
    })
    objAlert  = null
  })
})

module.exports = Router;
