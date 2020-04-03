/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('employees', {
    EmpId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    EmpName: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    MobileNumber: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    EmpRole: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    EmpAddr: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    EmpStatus: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    EmpPAss: {
      type: DataTypes.STRING(15),
      allowNull: false
    }
  }, {
    tableName: 'employees'
  });
};
