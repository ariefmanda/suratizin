const express     = require('express')
const Router      = express.Router()

Router.get('/', (req, res) => {
  req.session.isLogin = false
  req.session.destroy((err) => {
    if (!err) {
      res.locals.user = undefined
      res.redirect('/admin/login')
    }
  })
})
module.exports = Router;
