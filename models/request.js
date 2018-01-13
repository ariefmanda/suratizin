'use strict';
module.exports = (sequelize, DataTypes) => {
  var request = sequelize.define('request', {
    CustomerId: DataTypes.INTEGER,
    location_province: DataTypes.INTEGER,
    location_city: DataTypes.STRING,
    necessities: DataTypes.STRING,
    photo_building: DataTypes.STRING,
    photo_plan: DataTypes.STRING,
    attachment: DataTypes.STRING,
    needed_date: DataTypes.DATE,
    remark: DataTypes.TEXT,
    payment_method: DataTypes.INTEGER,
    status: DataTypes.INTEGER
  });
  return request;
};