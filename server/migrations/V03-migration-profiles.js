'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("\
        CREATE TABLE IF NOT EXISTS Profiles(\
            username TEXT references Accounts(username)\
                on delete CASCADE,\
            name TEXT not null,\
            picture TEXT,\
            address VARCHAR(100),\
            primary key (username)\
        )\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Profiles");
  }
};