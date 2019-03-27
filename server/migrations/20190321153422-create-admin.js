'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
      CREATE TABLE Admins(\
      id INTEGER primaryKey references Accounts,\
      rights STRING\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Admins');
  }
};