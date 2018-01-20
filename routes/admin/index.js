const Model = require("../../models");
const message = require("../../helpers/message");
const express = require('express')
const Router  = express.Router()
var title   = 'Dashboard'
let objAlert = null;

Router.get('/', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    res.render('./admin/index', {
      path        : 1,
      title       : title,
      action      : '',
      setting     : setting[0],
      new_button  : false,
      alert       : null,
    })
  })
  .catch((err) => {
    objAlert = message.error(err.message);
    res.redirect("/admin");
  })
  objAlert = null;
})

Router.get('/logout', (req, res) => {
  req.session.isLogin = false
  req.session.destroy((err) => {
    if (!err) {
      res.locals.user = undefined
      res.redirect('/admin/login')
    }
  })
})

Router.get('/setting', (req, res) => {
  Model.Setting.findAll().then(function(setting) {
    if (!setting) {
      let objSetting = {
        app_name: null,
        app_logo: null,
        app_favicon: null,
        app_copyright: null,
        app_admintheme: null,
        app_publictheme: null,
        mail_host: null,
        mail_port: null,
        mail_secure: null,
        mail_username: null,
        mail_password: null,
        sms_apikey: null,
        sms_apisecret: null
      };
      Model.Setting.create(objSetting).then(function() {
        Model.Setting.findAll().then(function(setting) {
          res.render("./admin/index", {
            path : 2,
            title: 'Setting',
            action: "",
            new_button: false,
            setting: setting[0],
            alert: objAlert
          });
          objAlert = null;
        });
      });
    } else {
      res.render("./admin/index", {
        path : 2,
        title: 'Setting',
        action: "",
        new_button: false,
        setting: setting[0],
        alert: objAlert
      });
      objAlert = null;
    }
  });
});

Router.post("/setting", (req, res) => {
  Model.Setting.findAll().then(function(setting) {
    let mail_secure =
      req.body.mail_secure == undefined ? 1 : req.body.mail_secure;

    let objSetting = {
      app_name: req.body.app_name,
      app_logo: null,
      app_favicon: null,
      app_copyright: req.body.app_copyright,
      mail_host: req.body.mail_host,
      mail_port: req.body.mail_port,
      mail_secure: mail_secure,
      mail_username: req.body.mail_username,
      mail_password: req.body.mail_password,
      sms_apikey: req.body.sms_apikey,
      sms_apisecret: req.body.sms_apisecret,
      app_admintheme: req.body.app_admintheme,
      app_publictheme: req.body.app_publictheme
    };
    Model.Setting.update(objSetting, {
      where: {
        id: setting[0].id
      }
    })
      .then(function() {
        objAlert = message.success();
        res.redirect("/admin/setting");
      })
      .catch(function(err) {
        objAlert = message.error(err.message);
        res.redirect("/admin/setting");
      });
      objAlert = null;
  });
});

Router.get('/register', (req, res) => {
  Model.Setting.findAll()
  .then(function(setting) {
    Model.Admin.findAll()
    .then(function(admin) {
      res.render('./admin/index', {
        path        : 3,
        title       : 'Register Admin',
        action      : '',
        admin       : admin,
        setting     : setting[0],
        new_button  : true,
        alert       : null,
      })
      objAlert = null;
    })
  })
})

module.exports = Router;
