'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Admins', [{
      name: 'Superadmin',
      email: 'superadmin@suratizin.com',
      password: '$2a$10$SFgNj5HffJA2fomteTTyDe01s9Md2ZXAPHhoSPk3FUgmrxdO2NoP.',
      role: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
