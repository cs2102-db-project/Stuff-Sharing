'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkInsert('Transactions', [{
        transId: 1,
        loanerId: 1,
        loaneeId: 2,
        itemId: 1,
        status: 'ONGOING',
        cost: 10.00,
        startDate: '01-01-2019',
        endDate: '30-01-2019'
      }], {});
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.
    */
      return queryInterface.bulkDelete('Transactions', null, {});
  }
};
