'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
        CREATE TYPE status_t as enum('ONGOING', 'ENDED');\
        \
        CREATE TABLE Transactions(\
            transId INTEGER,\
            loaner STRING not null,\
            loanee STRING not null,\
            status status_t not null,\
            cost DECIMAL(10, 2) not null,\
            startDate DATE not null,\
            endDate DATE,\
            primary key (transId)\
        )\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Transactions");
  }
};