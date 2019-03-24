'use strict';
module.exports = (sequelize, DataTypes) => {
  const service = sequelize.define('service', {
    stuffId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  service.associate = function(models) {
    // associations can be defined here
  };
  return service;
};