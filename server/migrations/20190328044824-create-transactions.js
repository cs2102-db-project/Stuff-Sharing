'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
      CREATE TYPE status_t as enum('ONGOING', 'ENDED');\
      \
      CREATE TABLE Transactions(\
      transId INTEGER primaryKey,\
      loaner STRING,\
      loanee STRING,\
      status status_t,\
      cost DECIMAL(10, 2),\
      startDate DATE,\
      endDate DATE\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Transactions');
  }
};