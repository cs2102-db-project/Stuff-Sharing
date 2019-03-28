'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
        CREATE TABLE Deliverables(\
            stuffId INTEGER references Stuff(stuffId),\
            deliveryCost FLOAT8 not null,\
            primary key (stuffId)\
        )\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Deliverables");
  }
};