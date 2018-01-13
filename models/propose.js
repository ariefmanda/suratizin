'use strict';
module.exports = (sequelize, DataTypes) => {
  var propose = sequelize.define('propose', {
    CompanyId: DataTypes.INTEGER,
    CustomerId: DataTypes.INTEGER,
    RequestId: DataTypes.INTEGER,
    price: DataTypes.FLOAT,
    negotiable: DataTypes.INTEGER,
    attachment: DataTypes.STRING,
    info_partner: DataTypes.TEXT,
    status: DataTypes.INTEGER
  });
  return propose;
};