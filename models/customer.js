'use strict';
module.exports = (sequelize, DataTypes) => {
  var customer = sequelize.define('customer', {
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    gender: DataTypes.INTEGER,
    handphone: DataTypes.STRING,
    address: DataTypes.TEXT,
    photo: DataTypes.STRING,
    reset_token: DataTypes.STRING,
    reset_expired: DataTypes.DATE
  });
  return customer;
};