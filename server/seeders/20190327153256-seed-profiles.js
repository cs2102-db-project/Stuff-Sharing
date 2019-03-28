'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkInsert('Profiles', [{
        userId: 1,
        name: 'John Doe',
        picture: 'picture?',
        address: '10 john road'
      }, {
        userId: 2,
        name: 'Jane Doe',
        picture: 'picture?',
        address: '10 jane road'
      }
      ], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkDelete('Profiles', null, {});
  }
};
