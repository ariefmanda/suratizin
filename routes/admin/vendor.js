const Model = require("../../models");
const message = require("../../helpers/message");
const express = require("express");
const app = express()
const Router = express.Router();
const getRole = require("../../helpers/getRole");
const library = require("../../helpers/library");
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

module.exports = {
  listGet,
  editGet,
  editPost,
  deleteGet
};
