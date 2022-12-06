'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Penilaians', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_guru: {
        type: Sequelize.INTEGER
      },
      id_siswa: {
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING
      },
      nama: {
        type: Sequelize.STRING
      },
      kontak: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Penilaians');
  }
};