const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const Order = sequelize.define('Order', {
  id:        { type: DataTypes.INTEGER,        primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING,         allowNull: false },
  lastName:  { type: DataTypes.STRING,         allowNull: false },
  email:     { type: DataTypes.STRING,         allowNull: false },
  address:   { type: DataTypes.STRING,         allowNull: false },
  city:      { type: DataTypes.STRING,         allowNull: false },
  province:  { type: DataTypes.STRING,         allowNull: false },
  zip:       { type: DataTypes.STRING },
  phone:     { type: DataTypes.STRING,         allowNull: false },
  total:     { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  paymentId: { type: DataTypes.STRING },
  status:    { type: DataTypes.STRING,         defaultValue: 'pending' },
  user_id:   {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  },

  // 🌟 PONERLOS AQUÍ ADENTRO SOLUCIONA TODO:
  // Definimos los campos físicos reales como atributos normales permitiendo valores nulos
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'Orders', 
  timestamps: true // Dejamos que Sequelize maneje el tiempo usando los campos nulos que declaramos arriba
});

module.exports = Order;