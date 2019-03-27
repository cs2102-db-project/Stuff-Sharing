'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
      CREATE TABLE Accounts(\
      id INTEGER primaryKey,\
      username STRING,\
      password STRING,\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Accounts');
  }
};