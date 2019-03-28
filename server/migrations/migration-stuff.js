'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
        CREATE TABLE Stuff(\
            stuffId INTEGER,\
            picture TEXT,\
            name VARCHAR(100) not null,\
            primary key (stuffId)\
        )\
    ")
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Stuff");
  }
};