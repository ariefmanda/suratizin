const Model = require("../../models");
const message = require("../../helpers/message");
const express = require("express");
const app = express()
const Router = express.Router();
const getRole = require("../../helpers/getRole");
const library = require("../../helpers/library");
const template = require("../../helpers/templateemail");
const multer = require('multer')
const send = require('../../helpers/notification')
let objAlert = null;

function listGet(req, res) {
  Model.Setting.findAll().then(function(setting) {
    Model.User.findAll().then(function(user) {
      user.map(e => {
        e.roleName = getRole(e.role);
        e.encryptId = library.encrypt(String(e.id));
      });
      res.render("./admin/index", {
        path: 5,
        title: "List User",
        action: "",
        user: user,
        setting: setting[0],
        new_button: true,
        alert: objAlert
      });
      objAlert = null;
    })
  }).catch(err => {
    objAlert = message.error(err.message);
    res.redirect("/admin/user");
  });
}
function showGet(req, res) {
  Model.Setting.findAll().then(function(setting) {
    Model.User.findById(library.decrypt(req.params.token))
    .then(user => {
      // if(user.role>3){
        // Model.Request.findAll({
        //   where:{
        //     UserId:user.id
        //   }
        // })
        // .then(request=>{
        //   console.log(request);
          res.render("./admin", {
            path: 6,
            title: "Show User",
            action: "",
            user,
            setting: setting[0],
            new_button: true,
            alert: objAlert
          });
        // })
      // }else{
      //   Promise.all([
      //     user,
      //     Model.Company.findAll({
      //       where:{
      //         UserId:user.id
      //       }
      //     })
      //   ])
      //   .then(([user,company])=>{
      //     res.redirect('/admin')
      //   })
      // }
    })
  }).catch(err => {
    objAlert = message.error(err.message);
    res.redirect(`/admin/user/show/${req.params.token}`);
  });
}

function aktifasiGet(req, res) {
  Model.User.findById(library.decrypt(req.params.token)).then(function(user) {
    Model.Setting.findAll().then(function(setting) {
      if (user) {
        let info = "";
        let token = library.randomValueBase64(64);
        let link = req.headers.host + "/activation/" + token;
        let objUser = {
          reset_token: token,
          reset_expired: Date.now() + 3600000
        };

        let promiseSendEmail = new Promise(function(resolve, reject) {
          let objMail = {
            to: user.email,
            subject: `[${setting[0].app_name}] Permintaan reset password.`,
            body: template.registered_success(setting, user, link)
          };
          send.email(objMail, function(error, info) {
            if (!error) {
              info = `aktifasi telah dikirim ke email ${user.email}`;
              console.log(info);
              resolve(info);
            } else {
              info = "Gagal untuk mengirimkan reset password !!";
              console.log(error);
              reject(error);
            }
          });
        });

        let promiseUpdateUser = new Promise(function(resolve, reject) {
          Model.User.update(objUser, {
            where: {
              id: user.id
            }
          }).then(function() {
            info = "The record has been successfully updated.";
            resolve(info);
          }).catch(function(err) {
            info = err;
            reject(err);
          });
        });

        Promise.all([promiseSendEmail, promiseUpdateUser]).then(function() {
          Model.User.findAll().then(function(userNew) {
            userNew.map(e => {
              e.roleName = getRole(e.role);
              e.encryptId = library.encrypt(String(e.id));
              if (e.id == user.id) {
                e.pending = 1
              }
            });
            objAlert = message.seccess(info)
            res.render("./admin/index", {
              path: 5,
              title: "List User",
              action: "",
              user: userNew,
              setting: setting[0],
              new_button: true,
              alert: info
            });
            objAlert = null;
          })
        }).catch(function(err) {
          objAlert = message.error(err.message);
          res.redirect('/admin/user')
        });
      }
    });
  });
}
function nonaktifGet(req, res) {
  Model.User.update({
    status: 0
  }, {
    where: {
      id: library.decrypt(req.params.token)
    }
  }).then(user => {
    objAlert = message.success("Akun sudah di non aktifkan")
    res.redirect('/admin/user')
  }).catch(err => {
    objAlert = message.error(err.message);
    res.redirect(`/admin/user`);
  })
}

module.exports = {
  listGet,
  showGet,
  aktifasiGet,
  nonaktifGet
};
