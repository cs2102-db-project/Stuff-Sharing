'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkInsert('Stuffs', [{
        stuffId: 1,
        name: 'book',
        picture: 'picture?',
        owner: 'John Doe'
      }, {
        stuffId: 2,
        name: 'car',
        picture: 'picture?',
        owner: 'John Doe'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkDelete('Stuffs', null, {});
  }
};
