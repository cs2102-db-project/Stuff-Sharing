'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkInsert('Stuff', [{
        stuffId: 1,
        name: 'book',
        picture: 'picture?',
        owner: 'johndoe',
        description: 'its a book'
      }, {
        stuffId: 2,
        name: 'car',
        picture: 'picture?',
        owner: 'johndoe',
        description: 'its a car'
      }, {
        stuffId: 3,
        name: 'car wash',
        picture: 'picture?',
        owner: 'janedoe',
        description: 'its a car wash'
      }, {
        stuffId: 4,
        name: 'math notes',
        picture: 'picture?',
        owner: 'janedoe',
        description: 'its math notes'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkDelete('Stuff', null, {});
  }
};
