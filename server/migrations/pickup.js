'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
        CREATE TABLE Pickups\
        stuffId INTEGER references Stuff,\
        pickupAddress varchar(100) not null,\
        primary key (StuffId)\
    ")
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Pickups");
  }
};