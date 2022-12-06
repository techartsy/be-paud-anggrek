'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Siswas', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      nik_anak: {
        type: Sequelize.STRING
      },
      nomor_pendaftaran: {
        type: Sequelize.STRING
      },
      kelompok_belajar: {
        type: Sequelize.STRING
      },
      nama_lengkap: {
        type: Sequelize.STRING
      },
      nama_panggilan: {
        type: Sequelize.STRING
      },
      jenis_kelamin: {
        type: Sequelize.STRING
      },
      tempat_lahir: {
        type: Sequelize.STRING
      },
      agama: {
        type: Sequelize.STRING
      },
      kewarganegaraan: {
        type: Sequelize.STRING
      },
      anak_ke_dari: {
        type: Sequelize.STRING
      },
      tinggi_badan: {
        type: Sequelize.STRING
      },
      berat_badan: {
        type: Sequelize.STRING
      },
      alamat_rumah: {
        type: Sequelize.STRING
      },
      penyakit_diderita: {
        type: Sequelize.STRING
      },
      penyakit_berat: {
        type: Sequelize.STRING
      },
      pantangan_makan: {
        type: Sequelize.STRING
      },
      nama_ayah: {
        type: Sequelize.STRING
      },
      telpon_ayah: {
        type: Sequelize.STRING
      },
      pekerjaan_ayah: {
        type: Sequelize.STRING
      },
      pendidikan_ayah: {
        type: Sequelize.STRING
      },
      agama_ayah: {
        type: Sequelize.STRING
      },
      penghasilan_ayah: {
        type: Sequelize.STRING
      },
      nama_ibu: {
        type: Sequelize.STRING
      },
      pekerjaan_ibu: {
        type: Sequelize.STRING
      },
      telpon_ibu: {
        type: Sequelize.STRING
      },
      agama_ibu: {
        type: Sequelize.STRING
      },
      pendidikan_ibu: {
        type: Sequelize.STRING
      },
      penghasilan_ibu: {
        type: Sequelize.STRING
      },
      foto_murid: {
        type: Sequelize.STRING
      },
      kartu_keluarga: {
        type: Sequelize.STRING
      },
      akta_kelahiran: {
        type: Sequelize.STRING
      },
      status_pendaftaran: {
        type: Sequelize.STRING
      },
      status_akademik: {
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
    await queryInterface.dropTable('Siswas');
  }
};