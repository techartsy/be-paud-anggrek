'use strict';
const {
  Model
} = require('sequelize');
// const { hashPass } = require('../src/utils/bcrypt');
const { hashPass } = require('../src/utils/brcypt');
module.exports = (sequelize, DataTypes) => {
  class Guru extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Guru.hasMany(models.Penilaian, {
        as: 'teacherAssessment',
        foreignKey: {
          name: 'id_guru',
        },
      });
      Guru.hasMany(models.Certificate, {
        as: 'teacherData',
        foreignKey: {
          name: 'id_guru',
        },
      });
    }
  };
  Guru.init({
    nama: DataTypes.STRING,
    image: DataTypes.STRING,
    jabatan: DataTypes.STRING,
    email: DataTypes.STRING,
    no_telpon: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate(teacher) {
        teacher.password = hashPass(teacher.password)
      },
    },
    sequelize,
    modelName: 'Guru',
  });
  return Guru;
};