'use strict';
module.exports = (sequelize, DataTypes) => {
  const Intangible = sequelize.define('Intangible', {
    stuffId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  Intangible.associate = function(models) {
    // associations can be defined here
  };
  return Intangible;
};