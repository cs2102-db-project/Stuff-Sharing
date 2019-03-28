'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("\
        CREATE TYPE status_t as enum('ONGOING', 'ENDED');\
        \
        CREATE TABLE IF NOT EXISTS Transactions(\
            transId INTEGER,\
            loaner TEXT not null,\
            loanee TEXT not null,\
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