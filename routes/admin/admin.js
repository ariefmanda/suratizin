const Model = require("../../models");
const message = require("../../helpers/message");
const express = require("express");
const app = express()
const Router = express.Router();
const getRole = require("../../helpers/getRole");
const library = require("../../helpers/library");
let objAlert = null;

function listGet(req, res) {
  (req.session.user.role != 0)
    ? res.redirect('/admin')
    : '';
  Model.Setting.findAll().then(function(setting) {
    Model.Admin.findAll().then(function(admin) {
      admin.map(e => {
        e.roleName = getRole(e.role);
        e.encryptId = library.encrypt(String(e.id));
      });
      res.render("./admin/index", {
        path: 3,
        title: "Register Admin",
        action: "",
        admin: admin,
        setting: setting[0],
        new_button: true,
        alert: objAlert
      });
      objAlert = null;
    })
  }).catch(err => {
    objAlert = message.error(err.message);
    res.redirect("/admin/admin");
  });
}

function addGet(req, res) {
  (req.session.user.role != 0)
    ? res.redirect('/admin')
    : '';
  Model.Setting.findAll().then(function(setting) {
    res.render("./admin", {
      path: 4,
      title: "Form New Register Admin",
      action: "",
      admin: null,
      setting: setting[0],
      new_button: true,
      alert: objAlert
    });
    objAlert = null;
  }).catch(err => {
    objAlert = message.error(err.message);
    res.redirect("/admin/admin");
  });
}

function addPost(req, res) {
  if (req.body.password != req.body.password_repeat) {
    objAlert = message.error("Password repeat false");
    res.redirect("/admin/admin/add");
  } else {
    if (req.session.user.role == 0) {
      Model.Admin.create({
        name: req.body.name,
        email: req.body.email,
        role: 1,
        gender: req.body.gender,
        handphone: req.body.handphone,
        address: req.body.address,
        password: library.encrypt(req.body.password)
      }).then(() => {
        objAlert = message.success();
        res.redirect("/admin/admin");
      }).catch(err => {
        objAlert = message.error(err.message);
        res.redirect("/admin/admin/add");
      });
    } else {
      res.redirect("/user");
    }
  }
}
function editGet(req, res) {
  (req.session.user.role != 0)
    ? res.redirect('/admin')
    : '';
  Model.Setting.findAll().then(function(setting) {
    Model.Admin.findById(library.decrypt(req.params.token)).then(admin => {
      res.render("./admin", {
        path: 4,
        title: "Form Edit Register Admin",
        action: "",
        admin,
        setting: setting[0],
        new_button: true,
        alert: objAlert
      });
      objAlert = null;
    })
  }).catch(err => {
    objAlert = message.error(err.message);
    res.redirect(`/admin/admin/edit/${req.params.token}`);
  });
}
function editPost(req, res) {
  (req.session.user.role != 0)
    ? res.redirect('/admin')
    : '';
  let data = null
  if (req.body.password != req.body.password_repeat) {
    objAlert = message.error("Password repeat false");
    res.redirect(`/admin/admin/edit/${req.params.token}`);
  } else {
    if (req.body.password) {
      data = {
        id: Number(library.decrypt(req.params.token)),
        name: req.body.name,
        email: req.body.email,
        role: 1,
        gender: req.body.gender,
        handphone: req.body.handphone,
        address: req.body.address,
        password: library.encrypt(req.body.password),
        updatedAt: new Date()
      }
    } else {
      data = {
        id: Number(library.decrypt(req.params.token)),
        name: req.body.name,
        email: req.body.email,
        role: 1,
        gender: req.body.gender,
        handphone: req.body.handphone,
        address: req.body.address,
        updatedAt: new Date()
      }
    }
    Model.Admin.update(data, {
      where: {
        id: Number(library.decrypt(req.params.token))
      },
      individualHooks: false
    }).then(admin => {
      objAlert = message.success("Data berhasi diupdate");
      return res.redirect("/admin/admin");
    }).catch(err => {
      objAlert = message.error(err.message);
      res.redirect(`/admin/admin/edit/${req.params.token}`);
    });
  }
}
function deleteGet(req, res) {
  (req.session.user.role != 0)
    ? res.redirect('/admin')
    : '';
  Model.Admin.destroy({
    where: {
      id: Number(library.decrypt(req.params.token))
    }
  }).then(() => {
    objAlert = message.success("Data berhasi dihapus");
    res.redirect("/admin/admin");
  }).catch(err => {
    objAlert = message.error(err.message);
    res.redirect("/admin/admin");
  })
}
module.exports = {
  listGet,
  addGet,
  addPost,
  editGet,
  editPost,
  deleteGet
};
