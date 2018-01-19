const Model       = require('../../models')
const express     = require('express')
const Sequelize   = require('sequelize')
const Router      = express.Router()
const title       = 'Login Admin'
let message_login = null;
Router.get('/', (req, res) => {
  if(req.session.isLogin){
    res.redirect('/admin')
  }else{
    res.render('./admin/login', {
      title         : title,
      message_login : message_login
    })
    message_login=null
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
          res.redirect('/admin')
          message_login=null
        } else {
          req.session.isLogin = false //>>> ganti false
          req.session.user = undefined //>> ganti undefines
          message_login = 'Incorrect Username or Password !!'
          res.redirect('/admin/login')
        }
      })
    }
  })
  .catch((err) => {
    message_login = err.message
    res.redirect('admin/login')
  })
})

module.exports = Router;
