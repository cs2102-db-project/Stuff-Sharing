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
      }, {
        stuffId: 3,
        name: 'car wash',
        picture: 'picture?',
        owner: 'Jane Doe'
      }, {
        stuffId: 4,
        name: 'math notes',
        picture: 'picture?',
        owner: 'Jane Doe'
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
