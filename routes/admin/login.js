const Model       = require('../../models')
const express     = require('express')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'Login Admin'

Router.get('/', (req, res) => {
  res.render('./admin/login', {
    title         : title,
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
