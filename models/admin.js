'use strict';
const crypto = require('crypto');
const cipher = crypto.createCipher('aes192', 'surat-izin-2018');
module.exports = (sequelize, DataTypes) => {
  var Admin = sequelize.define('Admin', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    role: DataTypes.INTEGER,
    gender: DataTypes.INTEGER,
    handphone: DataTypes.STRING,
    address: DataTypes.TEXT,
    photo: DataTypes.STRING,
    reset_token: DataTypes.STRING,
    reset_expired: DataTypes.DATE
  });

  Admin.prototype.check_password = function (password, callback) {
    let encrypted = cipher.update(password, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    if(this.password == encrypted){
      callback(true)
    }else{
      callback(false)
    }
  }

  return Admin;
};
