'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("\
        CREATE TABLE IF NOT EXISTS Reviews(\
            reviewId INTEGER,\
            transactionId INTEGER not null references Transactions,\
            rating int4range(0,10) INTEGER not null,\
            details TEXT not null,\
            primary key (reviewId)\
        )\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Reviews");
  }
};