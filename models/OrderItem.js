// models/OrderItem.js
const { DataTypes } = require('sequelize');
const sequelize     = require('../config/database');

const OrderItem = sequelize.define('OrderItem', {
  id:       { type: DataTypes.INTEGER,        primaryKey: true, autoIncrement: true },
  quantity: { type: DataTypes.INTEGER,        allowNull: false },
  // Precio al momento de la compra (snapshot)
  price:    { type: DataTypes.DECIMAL(10, 2), allowNull: false },

  store_id: {
    type: DataTypes.INTEGER,
    allowNull: true,  // permite null para ordenes antiguas
    references: { model: 'stores', key: 'id' }
  }
});

module.exports = OrderItem;