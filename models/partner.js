'use strict';
module.exports = (sequelize, DataTypes) => {
  var partner = sequelize.define('partner', {
    AdminId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    handphone: DataTypes.STRING,
    address: DataTypes.TEXT,
    photo: DataTypes.STRING,
    reset_token: DataTypes.STRING,
    reset_expired: DataTypes.DATE,
    photo_ic: DataTypes.STRING,
    photo_wic: DataTypes.STRING,
    status: DataTypes.INTEGER
  });
  return partner;
};