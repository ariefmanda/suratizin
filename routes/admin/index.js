const Model   = require('../../models')
const express = require('express')
const Router  = express.Router()
const title   = 'Dashboard'

Router.get('/', (req, res) => {
  res.render('./admin/index', {
    title       : title,
    action      : '',
    new_button  : false,
    alert       : null,
  })
})

module.exports = Router;
