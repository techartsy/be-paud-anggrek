'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Penilaian extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Penilaian.belongsTo(models.Siswa, {
        as: 'userAssessment',
        foreignKey: {
          name: 'id_siswa',
        },
      });
      Penilaian.belongsTo(models.Guru, {
        as: 'teacherAssessment',
        foreignKey: {
          name: 'id_guru',
        },
      });
    }
  };
  Penilaian.init({
    id_guru: DataTypes.INTEGER,
    id_siswa: DataTypes.INTEGER,
    message: DataTypes.STRING,
    nama: DataTypes.STRING,
    kontak: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Penilaian',
  });
  return Penilaian;
};