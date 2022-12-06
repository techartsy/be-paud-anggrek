'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Testimony extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Testimony.belongsTo(models.Siswa, {
        as: 'userTestimony',
        foreignKey: {
          name: 'id_siswa',
        },
      });
    }
  };
  Testimony.init({
    id_siswa: DataTypes.INTEGER,
    nama: DataTypes.STRING,
    message: DataTypes.STRING,
    timestamp: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Testimony',
  });
  return Testimony;
};