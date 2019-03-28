'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("\
        CREATE TABLE IF NOT EXISTS Services(\
            stuffId INTEGER,\
            primary key (stuffId)\
        )\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Services");
  }
};