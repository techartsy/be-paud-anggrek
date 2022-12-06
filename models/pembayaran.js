'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pembayaran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Pembayaran.belongsTo(models.Siswa, {
        as: 'userPayment',
        foreignKey: {
          name: 'id_siswa',
        },
      });
    }
  };
  Pembayaran.init({
    id_siswa: DataTypes.INTEGER,
    kode_pembayaran: DataTypes.STRING,
    nama_bank: DataTypes.STRING,
    nama_pengirim: DataTypes.STRING,
    metode_pembayaran: DataTypes.STRING,
    pembayaran_pertama: DataTypes.STRING,
    pembayaran_kedua: DataTypes.STRING,
    pembayaran_ketiga: DataTypes.STRING,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Pembayaran',
  });
  return Pembayaran;
};