const express = require('express')
const Router  = express.Router()
const title   = 'Forgot password'
const library     = require('../../helpers/library');

Router.post('/', (req, res) => {
  Model.User.findOne({
    where: {
      email: req.body.email,
    }
  })
  .then(function(user) {
    if (user) {
      let link  = req.headers.host + '/reset/'
      let token = randomValueBase64(64)
      let objMail = {
        to      : user.email,
        subject : '[Trippediacity] Request Reset Your Password',
        body    : email.reset_password(user, link + token),
      }

      send.email(objMail, function(error, info) {
        if (!error) {
          let objReset = {
            reset_password_token    : token,
            reset_password_expires  : Date.now() + 3600000,
          }
          Model.User.update(objReset, {
            where: {
              id: user.id,
            },
          })
          .then(function() {
            res.render('./login', {
              title         : title,
              message_login : null,
              message_reset : null,
              success_reset : 'Great. We have sent you an email. Please check your email !!',
            })
          })
        } else {
          res.render('./login', {
            title         : title,
            message_login : null,
            message_reset : error,
            success_reset : null,
          })
        }
      })
    } else {
      res.render('./login', {
        title         : title,
        message_login : null,
        message_reset : 'Incorrect Email !!',
        success_reset : null,
      })
    }
  })
})
module.exports = Router;
