'use strict';
module.exports = (sequelize, DataTypes) => {
  const Pickup = sequelize.define('Pickup', {
    stuffId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    pickupAddress: DataTypes.STRING
  }, {});
  Pickup.associate = function(models) {
    // associations can be defined here
  };
  return Pickup;
};