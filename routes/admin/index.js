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
  Model.Setting.findAll()
    .then(function(setting) {
      res.render("./admin/index", {
        path: 1,
        title: title,
        action: "",
        setting: setting[0],
        new_button: false,
        alert: null
      });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin");
    });
  objAlert = null;
});


Router.get("/setting", (req, res) => {
  (req.session.user.role != 0)? res.redirect('/admin'):''; 
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
            path: 2,
            title: "Setting",
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
        path: 2,
        title: "Setting",
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
  (req.session.user.role != 0)? res.redirect('/admin'):''; 
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
  });
});

Router.get("/register", (req, res) => {
  (req.session.user.role != 0)? res.redirect('/admin'):''; 
  Model.Setting.findAll()
    .then(function(setting) {
      Model.Admin.findAll()
        .then(function(admin) {
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
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect("/admin/register");
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/register");
    });
});
Router.get("/register/add", (req, res) => {
  (req.session.user.role != 0)? res.redirect('/admin'):''; 
  Model.Setting.findAll()
    .then(function(setting) {
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
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/register");
    });
});
Router.post("/register/add", (req, res) => {
  if (req.body.password !== req.body.password_repeat) {
    objAlert = message.error("Password repeat false");
    res.redirect("/admin/register/add");
  } else {
    if (req.session.user.role == 0) {
      Model.Admin.create({
        name: req.body.name,
        email: req.body.email,
        role: 1,
        gender: req.body.gender,
        handphone: req.body.handphone,
        address: req.body.address,
        password: req.body.password
      })
        .then(() => {
          objAlert = message.success();
          res.redirect("/admin/register");
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect("/admin/register/add");
        });
    } else {
      res.redirect("/user");
    }
  }
});

Router.get("/register/edit/:token", (req, res) => {
  (req.session.user.role != 0)? res.redirect('/admin'):''; 
  Model.Setting.findAll()
    .then(function(setting) {
      Model.Admin.findById(library.decrypt(req.params.token))
        .then(admin => {
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
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect(`/admin/register/edit/${req.params.token}`);
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect(`/admin/register/edit/${req.params.token}`);
    });
});
Router.post("/register/edit/:token", (req, res) => {
  (req.session.user.role != 0)? res.redirect('/admin'):''; 
  let data=null
  if(req.body.password){
    if(req.body.password !== req.body.password_repeat) {
      objAlert = message.error("Password repeat false");
      res.redirect(`/admin/register/edit/${req.params.token}`);
    }else{
      data = {
        id: Number(library.decrypt(req.params.token)),
        name: req.body.name,
        email: req.body.email,
        role: 1,
        gender: req.body.gender,
        handphone: req.body.handphone,
        address: req.body.address,
        password: req.body.password
      }
    }
  }else{
    data ={
      id: Number(library.decrypt(req.params.token)),
      name: req.body.name,
      email: req.body.email,
      role: 1,
      gender: req.body.gender,
      handphone: req.body.handphone,
      address: req.body.address
    }
  }
  console.log(data);
  Model.Setting.findAll()
    .then(function(setting) {
      Model.Admin.update(data,{
        where: {
          id: Number(library.decrypt(req.params.token))
        },
        individualHooks: false 
      })
        .then(admin => {
          objAlert = message.success("Data berhasi diupdate");
          res.redirect("/admin/register");
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect(`/admin/register/edit/${req.params.token}`);
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect(`/admin/register/edit/${req.params.token}`);
    });
});

Router.get("/register/delete/:token",(req,res)=>{
  (req.session.user.role != 0)? res.redirect('/admin'):''; 
  Model.Admin.destroy({
    where:{
      id: Number(library.decrypt(req.params.token))
    }
  })
  .then(()=>{
    objAlert = message.success("Data berhasi dihapus");
    res.redirect("/admin/register");
  })
  .catch(err=>{
    objAlert = message.error(err.message);
    res.redirect("/admin/register");
  })
})
Router.get("/listUser", (req, res) => {
  (req.session.user.role != 0)? res.redirect('/admin'):''; 
  Model.Setting.findAll()
    .then(function(setting) {
      Model.User.findAll()
        .then(function(user) {
          user.map(e => {
            e.roleName = getRole(e.role);
            e.encryptId = library.encrypt(String(e.id));
          });
          res.render("./admin/index", {
            path: 5,
            title: "Register Admin",
            action: "",
            user: user,
            setting: setting[0],
            new_button: true,
            alert: objAlert
          });
          objAlert = null;
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect("/admin/register");
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect("/admin/register");
    });
});
Router.get("/listUser/edit/:token", (req, res) => {
  (req.session.user.role != 0)? res.redirect('/admin'):''; 
  Model.Setting.findAll()
    .then(function(setting) {
      Model.User.findById(library.decrypt(req.params.token))
        .then(user => {
          res.render("./admin", {
            path: 6,
            title: "Form Edit Register Admin",
            action: "",
            user,
            setting: setting[0],
            new_button: true,
            alert: objAlert
          });
          objAlert = null;
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect(`/admin/listUser/edit/${req.params.token}`);
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect(`/admin/listUser/edit/${req.params.token}`);
    });
});
Router.post("/listUser/edit/:token", (req, res) => {
  (req.session.user.role != 0)? res.redirect('/admin'):''; 
  let data=null
  if(req.body.password){
    if(req.body.password !== req.body.password_repeat) {
      objAlert = message.error("Password repeat false");
      res.redirect(`/admin/listUser/edit/${req.params.token}`);
    }else{
      data = {
        id: Number(library.decrypt(req.params.token)),
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
        gender: req.body.gender,
        handphone: req.body.handphone,
        address: req.body.address,
        password: req.body.password,
        status: req.body.status
      }
    }
  }else{
    data ={
      id: Number(library.decrypt(req.params.token)),
      name: req.body.name,
      email: req.body.email,
      role: 1,
      gender: req.body.gender,
      handphone: req.body.handphone,
      address: req.body.address,
      status: req.body.status
    }
  }
  Model.Setting.findAll()
    .then(function(setting) {
      Model.User.update(data,{
        where: {
          id: Number(library.decrypt(req.params.token))
        },
        individualHooks: false 
      })
        .then(user => {
          objAlert = message.success("Data berhasi diupdate");
          res.redirect("/admin/listUser");
        })
        .catch(err => {
          objAlert = message.error(err.message);
          res.redirect(`/admin/listUser/edit/${req.params.token}`);
        });
    })
    .catch(err => {
      objAlert = message.error(err.message);
      res.redirect(`/admin/listUser/edit/${req.params.token}`);
    });
});

Router.get("/listUser/delete/:token",(req,res)=>{
  (req.session.user.role != 0)? res.redirect('/admin'):''; 
  Model.User.destroy({
    where:{
      id: Number(library.decrypt(req.params.token))
    }
  })
  .then(()=>{
    objAlert = message.success("Data berhasi dihapus");
    res.redirect("/admin/listUser");
  })
  .catch(err=>{
    objAlert = message.error(err.message);
    res.redirect("/admin/listUser");
  })
})
module.exports = Router;
