'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("\
        CREATE TABLE IF NOT EXISTS Admins(\
            username TEXT references Accounts(username),\
            primary key (username)\
        )\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Admins");
  }
};