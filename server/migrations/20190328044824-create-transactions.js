'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
      CREATE TYPE status_t as enum('ONGOING', 'ENDED');\
      \
      CREATE TABLE Transactions(\
      transId INTEGER primaryKey,\
      loanerId INTEGER,\
      loaneeId INTEGER references Profiles,\
      itemId INTEGER,\
      status status_t,\
      cost DECIMAL(10, 2),\
      startDate DATE,\
      endDate DATE,\
      foreign key(loanerId, itemId) references Owns\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Transactions');
  }
};