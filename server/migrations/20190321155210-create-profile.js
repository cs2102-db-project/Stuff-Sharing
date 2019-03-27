'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    queryInterface.sequelize.query("\
      CREATE TABLE Profiles(\
      userId INTEGER primaryKey references Account\
        on delete CASCADE,\
      name STRING,\
      picture STRING,\
      address STRING\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Profiles');
  }
};