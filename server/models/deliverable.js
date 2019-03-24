'use strict';
module.exports = (sequelize, DataTypes) => {
  const Deliverable = sequelize.define('Deliverable', {
    stuffId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    deliveryCost: DataTypes.FLOAT
  }, {});
  Deliverable.associate = function(models) {
    // associations can be defined here
  };
  return Deliverable;
};