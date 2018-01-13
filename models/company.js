'use strict';
module.exports = (sequelize, DataTypes) => {
  var company = sequelize.define('company', {
    PartnerId: DataTypes.INTEGER,
    AdminId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    logo: DataTypes.STRING,
    category: DataTypes.INTEGER,
    sub_category: DataTypes.INTEGER,
    description: DataTypes.TEXT,
    address: DataTypes.TEXT,
    province: DataTypes.INTEGER,
    city: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    fax: DataTypes.STRING,
    year_establishment: DataTypes.INTEGER,
    total_employes: DataTypes.INTEGER,
    website: DataTypes.STRING,
    bank_account_name: DataTypes.STRING,
    bank_name: DataTypes.STRING,
    bank_branch: DataTypes.STRING,
    bank_account_number: DataTypes.STRING,
    photo_siup: DataTypes.STRING,
    photo_valid_bill: DataTypes.STRING,
    validation: DataTypes.INTEGER
  });
  return company;
};