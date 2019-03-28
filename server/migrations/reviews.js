'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
      CREATE TABLE Profiles(\
      reviewId INTEGER primary key,\
      transactionId int4range(0,10) references Transactions,\
      rating INTEGER,\
      details TEXT\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Reviews');
  }
};