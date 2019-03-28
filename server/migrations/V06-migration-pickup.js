'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("\
        CREATE TABLE IF NOT EXISTS Pickups(\
            stuffId INTEGER references Stuff(stuffId),\
            pickupAddress VARCHAR(100) not null,\
            primary key (StuffId)\
        )\
    ")
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Pickups");
  }
};