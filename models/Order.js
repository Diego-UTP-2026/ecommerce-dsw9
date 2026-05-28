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
  tableName: 'Orders', // Mapea exactamente a tu tabla física en Aiven (image_e969e4.jpg)
  timestamps: true,    // Activa el control de tiempos automáticos de Sequelize

  // ── MAPEO EXPLÍCITO DE TIMESTAMPS ──────────────────────────────────────
  // Esto soluciona de raíz el error en /customer/dashboard y /store-admin.
  // Le dice a Sequelize: "En JS usa 'createdAt', pero en MySQL busca 'createdAt'"
  //createdAt: 'createdAt',
  createdAt: {
    type: DataTypes.DATE,
    allowNull: true,      // Esto evita que MySQL tire el error de '0000-00-00' al alterar la tabla
    field: 'createdAt'
  },
  //updatedAt: 'updatedAt'
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: true,
    field: 'updatedAt'
  }
});

module.exports = Order;