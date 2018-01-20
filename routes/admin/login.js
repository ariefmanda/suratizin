const Model       = require('../../models')
const express     = require('express')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'Login Admin'
const library     = require('../../helpers/library');
let message_login = null
let objAlert = null;
Router.get('/', (req, res) => {
    if(req.session.isLogin){
      res.redirect('/admin')
    }else{
      res.render('./admin/login', {
        title         : title,
        message_login
      })
    }
})
Router.post('/verification', (req, res) => {
  Model.Admin.findOne({
    where: {
      email: req.body.email,
    }
  })
  .then((admin) => {
    if (admin == null) {
      message_login = 'Incorrect Username or Password !!'
      res.redirect('admin/login')
    } else {
      admin.check_password(req.body.password, (isMatch) => {
        if (isMatch) {
          req.session.isLogin = true
          req.session.user = admin

          // let objLog = {
          //   UserId      : user.id,
          //   username    : user.username,
          //   ip_address  : getClientIp(req),
          //   last_login  : Date.now(),
          //   status      : 'success',
          // }
          // Model.Log.create(objLog)
          res.redirect('/admin')
          message_login=null
        } else {
          req.session.isLogin = false //>>> ganti false
          req.session.admin = undefined //>> ganti undefines
          message_login = 'Incorrect Username or Password !!',
          alert='danger'
          // let objLog = {
          //   UserId      : user.id,
          //   username    : user.username,
          //   ip_address  : getClientIp(req),
          //   last_login  : Date.now(),
          //   status      : 'danger',
          //   information : message_login,
          // }
          // Model.Log.create(objLog)
          res.redirect('/admin/login')
        }
        message_login=null
      })
    }
  })
  .catch((err) => {
    message_login = err.message
    res.redirect('/admin/login')
  })
})

module.exports = Router;
