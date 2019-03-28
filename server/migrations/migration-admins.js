'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
        CREATE TABLE Admins(\
            username TEXT references Accounts(username),\
            primary key (username)\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Admins");
  }
};