'use strict';
module.exports = (sequelize, DataTypes) => {
  const Transactions = sequelize.define('Transactions', {
    loaner: DataTypes.STRING
  }, {});
  Transactions.associate = function(models) {
    // associations can be defined here
  };
  return Transactions;
};