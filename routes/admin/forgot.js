const Model = require("../../models");
const message = require("../../helpers/message");
const library = require("../../helpers/library");
const template = require("../../helpers/templateemail");
const send = require("../../helpers/notification");
const express = require("express");
const Sequelize = require("sequelize");
const Router = express.Router();
const title = "Forgot";
let message_login = null;

Router.post("/", (req, res) => {
  Model.Admin.findOne({
    where: {
      email: req.body.email
    }
  }).then(function(admin) {
    Model.Setting.findAll().then(function(setting) {
      if (admin) {
        let info = "";
        let token = library.randomValueBase64(64);
        let link = req.headers.host + "/admin/reset/" + token;
        let objUser = {
          reset_token: token,
          reset_expired: Date.now() + 3600000
        };

        let promiseSendEmail = new Promise(function(resolve, reject) {
          let objMail = {
            to: req.body.email,
            subject: `[${setting[0].app_name}] Permintaan reset password.`,
            body: template.reset_password(admin, link)
          };
          send.email(objMail, function(error, info) {
            if (!error) {
              info = `Reset password telah dikirim ke email ${admin.email}`;
              console.log(info);
              resolve(info);
            } else {
              info = "Gagal untuk mengirimkan reset password !!";
              console.log(error);
              reject(error);
            }
          });
        });

        let promiseUpdateAdmin = new Promise(function(resolve, reject) {
          Model.Admin.update(objUser, {
            where: {
              id: admin.id
            }
          })
            .then(function() {
              info = "The record has been successfully updated.";
              resolve(info);
            })
            .catch(function(err) {
              info = err;
              reject(err);
            });
        });

        Promise.all([promiseSendEmail, promiseUpdateAdmin])
          .then(function() {
            res.render("./admin/login", {
              title: "Login",
              setting: setting[0],
              user: null,
              userSession: req.session.user,
              message_login: `Reset password telah dikirim ke email ${
                admin.email
              }`,
              alert: "success"
            });
            objAlert = null;
          })
          .catch(function(err) {
            res.render("./admin/login", {
              title: "Login",
              setting: setting[0],
              user: null,
              userSession: req.session.user,
              message_login: (err.message),
              alert:'danger'
            });
            objAlert = null;
          });
      } else {
        res.render("./admin/login", {
          title: "Login",
          setting: setting[0],
          user: null,
          userSession: req.session.user,
          message_login:
            "Email tidak terdaftar, silahkan lakukan pendaftaran !!"
          ,
          alert: "danger"
        });
        objAlert = null;
      }
    });
  });
});
Router.get("*",(req,res)=>{
  res.redirect('/admin')
})

module.exports = Router;
