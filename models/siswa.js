'use strict';
const {
  Model
} = require('sequelize');
// const { hashPass } = require('../src/utils/bcrypt');
const { hashPass } = require('../src/utils/brcypt');

module.exports = (sequelize, DataTypes) => {
  class Siswa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Siswa.hasMany(models.Penilaian, {
        as: 'userAssessment',
        foreignKey: {
          name: 'id_siswa',
        },
      });
      Siswa.hasMany(models.Testimony, {
        as: 'userTestimony',
        foreignKey: {
          name: 'id_siswa',
        },
      });
      Siswa.hasMany(models.Certificate, {
        as: 'userCertificate',
        foreignKey: {
          name: 'id_siswa',
        },
      });
      Siswa.hasMany(models.Pembayaran, {
        as: 'userPayment',
        foreignKey: {
          name: 'id_siswa',
        },
      });
    }
  };
  Siswa.init({
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    nik_anak: DataTypes.STRING,
    nomor_pendaftaran: DataTypes.STRING,
    kelompok_belajar: DataTypes.STRING,
    nama_lengkap: DataTypes.STRING,
    nama_panggilan: DataTypes.STRING,
    jenis_kelamin: DataTypes.STRING,
    tempat_lahir: DataTypes.STRING,
    agama: DataTypes.STRING,
    kewarganegaraan: DataTypes.STRING,
    anak_ke_dari: DataTypes.STRING,
    tinggi_badan: DataTypes.STRING,
    berat_badan: DataTypes.STRING,
    alamat_rumah: DataTypes.STRING,
    penyakit_diderita: DataTypes.STRING,
    penyakit_berat: DataTypes.STRING,
    pantangan_makan: DataTypes.STRING,
    nama_ayah: DataTypes.STRING,
    telpon_ayah: DataTypes.STRING,
    pekerjaan_ayah: DataTypes.STRING,
    pendidikan_ayah: DataTypes.STRING,
    agama_ayah: DataTypes.STRING,
    penghasilan_ayah: DataTypes.STRING,
    nama_ibu: DataTypes.STRING,
    pekerjaan_ibu: DataTypes.STRING,
    telpon_ibu: DataTypes.STRING,
    agama_ibu: DataTypes.STRING,
    pendidikan_ibu: DataTypes.STRING,
    penghasilan_ibu: DataTypes.STRING,
    foto_murid: DataTypes.STRING,
    kartu_keluarga: DataTypes.STRING,
    akta_kelahiran: DataTypes.STRING,
    status_pendaftaran: DataTypes.STRING,
    status_akademik: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(user) {
        user.password = hashPass(user.password)
        if (!user.status_pendaftaran) {
          user.status_pendaftaran = 'Pending'
        };
      },
    },
    sequelize,
    modelName: 'Siswa',
  });
  return Siswa;
};