/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vehicles_details', {
    VehicleNumber: {
      type: DataTypes.STRING(50),
      allowNull: false,
      primaryKey: true
    },
    VehicleName: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    Wheels: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    StageOfRepair: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    RepairingCost: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    CleaningCost: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    WashingCost: {
      type: DataTypes.STRING(15),
      allowNull: false
    },
    EmpId: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'employees',
        key: 'EmpId'
      }
    },
    DelayReason: {
      type: DataTypes.STRING(200),
      allowNull: false
    },
  }, {
    tableName: 'vehicles_details'
  });
};
