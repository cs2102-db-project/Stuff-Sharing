'use strict';
module.exports = (sequelize, DataTypes) => {
  const Non - Admin = sequelize.define('Non-Admin', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  Non - Admin.associate = function(models) {
    // associations can be defined here
  };
  return Non - Admin;
};