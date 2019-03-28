'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("\
        CREATE TABLE IF NOT EXISTS Stuff(\
            stuffId INTEGER,\
            picture TEXT,\
            name VARCHAR(100) not null,\
            owner TEXT,\
            description TEXT,\
            primary key (stuffId),\
            foreign key (owner) references Accounts\
        )\
    ")
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Stuff");
  }
};