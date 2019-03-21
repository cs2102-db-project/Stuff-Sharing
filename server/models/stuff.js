'use strict';
module.exports = (sequelize, DataTypes) => {
  const Stuff = sequelize.define('Stuff', {
    picture: DataTypes.STRING,
    name: DataTypes.STRING,
    stuffId: DataTypes.STRING
  }, {});
  Stuff.associate = function(models) {
    // associations can be defined here
  };
  return Stuff;
};