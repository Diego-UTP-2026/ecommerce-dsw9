// models/Order.js
// models/Order.js
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

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  }
}, {
  // ── ¡AGREGA ESTA SECCIÓN DE CONFIGURACIÓN AQUÍ! ──
  underscored: true, // Fuerza a Sequelize a usar snake_case para claves foráneas automáticas
  tableName: 'Orders' // Asegura que mapee exactamente a tu tabla de Aiven
});

module.exports = Order;



/*const { DataTypes } = require('sequelize');
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
  // pending | paid | payment_failed | canceled
  status:    { type: DataTypes.STRING,         defaultValue: 'pending' },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  }
});

// ── AGREGAR ASOCIACIONES EXPLÍCITAS ────────────────────────────
// Esto le dice a Sequelize que use 'user_id' al hacer Joins/Includes
Order.associate = (models) => {
  Order.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
};

module.exports = Order;*/

/*const { DataTypes } = require('sequelize');
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
  // pending | paid | payment_failed | canceled
  status:    { type: DataTypes.STRING,         defaultValue: 'pending' },

  user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: { model: 'users', key: 'id' }
  }
});

module.exports = Order;*/