'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("\
        CREATE TABLE IF NOT EXISTS Intangibles(\
            stuffId INTEGER references Stuff(stuffId),\
            primary key (stuffId)\
        )\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Intangibles");
  }
};