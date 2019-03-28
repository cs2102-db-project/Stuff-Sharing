'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("\
        CREATE TABLE IF NOT EXISTS Reviews(\
            reviewId INTEGER,\
            transId INTEGER not null references Transactions(transId),\
            rating INTEGER not null,\
            details TEXT not null,\
            primary key (reviewId),\
            check (rating >= 0 and rating <= 10)\
        )\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Reviews");
  }
};