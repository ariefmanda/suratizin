'use strict';
module.exports = (sequelize, DataTypes) => {
  var portofolio = sequelize.define('portofolio', {
    CompanyId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    photo: DataTypes.STRING,
    description: DataTypes.TEXT
  });
  return portofolio;
};