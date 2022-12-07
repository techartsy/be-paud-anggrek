'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Certificate extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Certificate.belongsTo(models.Siswa, {
        as: 'studentData',
        foreignKey: {
          name: 'id_siswa',
        },
      });
      Certificate.belongsTo(models.Guru, {
        as: 'teacherData',
        foreignKey: {
          name: 'id_guru',
        },
      });
    }
  };
  Certificate.init({
    id_siswa: DataTypes.INTEGER,
    id_guru: DataTypes.INTEGER,
    file: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Certificate',
  });
  return Certificate;
};