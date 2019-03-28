'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
      CREATE TABLE Non-Admins(\
      id INTEGER primaryKey references Accounts,\
      username STRING,\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Non-Admins');
  }
};