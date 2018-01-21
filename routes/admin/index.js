const Model = require("../../models");
const message = require("../../helpers/message");
const express = require("express");
const app = express()
const Router = express.Router();
const getRole = require("../../helpers/getRole");
const library = require("../../helpers/library");
var title = "Dashboard";
let objAlert = null;

Router.get("/", (req, res) => {
  Model.Setting.findAll().then(function(setting) {
    res.render("./admin/index", {
      path: 1,
      title: title,
      action: "",
      setting: setting[0],
      new_button: false,
      alert: null
    });
  }).catch(err => {
    objAlert = message.error(err.message);
    res.redirect("/admin");
  });
  objAlert = null;
});
Router.get("/profile", require('./profile').profileGet);
Router.post("/profile/upload", require('./profile').uploadPost);
Router.get("/setting", require('./setting').settingGet);
Router.post("/setting",require('./setting').settingPost );
Router.get("/admin", require('./admin').listGet);
Router.get("/admin/add", require('./admin').addGet);
Router.post("/admin/add", require('./admin').addPost);
Router.get("/admin/edit/:token", require('./admin').editGet);
Router.post("/admin/edit/:token", require('./admin').editPost);
Router.get("/admin/delete/:token", require('./admin').deleteGet)
Router.get("/user", require('./user').listGet);
Router.get("/user/show/:token", require('./user').showGet);
Router.get("/user/aktifasi/:token", require('./user').aktifasiGet);
Router.get("/user/nonaktif/:token", require('./user').nonaktifGet)
// Router.get("/vendor", require('./vendor').listGet);
// Router.get("/vendor/edit/:token", require('./vendor').editGet);
// Router.post("/vendor/edit/:token", require('./vendor').editPost);
// Router.get("/vendor/delete/:token", require('./vendor').deleteGet)
Router.get("*",(req,res)=>{
  res.redirect('/admin')
})
module.exports = Router;
