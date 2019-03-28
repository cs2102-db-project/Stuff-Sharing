'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("\
        CREATE TABLE IF NOT EXISTS Profiles(\
            userId INTEGER references Account\
                on delete CASCADE,\
            name STRING not null,\
            picture STRING,\
            address STRING,\
            primary key (userId)\
        )\
    ");
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query("DROP TABLE Profiles");
  }
};