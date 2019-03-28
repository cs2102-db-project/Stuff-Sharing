'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
        CREATE TABLE Intangibles(\
            stuffId INTEGER references Stuff(stuffId),\
            primary key (stuffId),\
        )\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Intangibles");
  }
};