'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pembayarans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      id_siswa: {
        type: Sequelize.INTEGER
      },
      kode_pembayaran: {
        type: Sequelize.STRING
      },
      nama_bank: {
        type: Sequelize.STRING
      },
      nama_pengirim: {
        type: Sequelize.STRING
      },
      metode_pembayaran: {
        type: Sequelize.STRING
      },
      pembayaran_pertama: {
        type: Sequelize.STRING
      },
      pembayaran_kedua: {
        type: Sequelize.STRING
      },
      pembayaran_ketiga: {
        type: Sequelize.STRING
      },
      status: {
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
    await queryInterface.dropTable('Pembayarans');
  }
};