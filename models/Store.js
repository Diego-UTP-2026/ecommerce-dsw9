// models/Store.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcrypt');

const Store = sequelize.define('Store', {
  name:          { type: DataTypes.STRING(100), allowNull: false },
  // 🌟 Quitamos 'unique: true' de aquí:
  slug:          { type: DataTypes.STRING(100), allowNull: false }, 
  description:   { type: DataTypes.TEXT },
  logo_url:      { type: DataTypes.STRING(255) },
  owner_name:    { type: DataTypes.STRING(100), allowNull: false },
  // 🌟 Quitamos 'unique: true' de aquí también:
  email:         { type: DataTypes.STRING(150), allowNull: false }, 
  password_hash: { type: DataTypes.STRING(255), allowNull: false },
  paypal_email:  { type: DataTypes.STRING(150) },   // para recibir payouts
  status:        { type: DataTypes.ENUM('pending','active','suspended'),
                   defaultValue: 'active' }
}, { 
  tableName: 'stores', 
  timestamps: true,
  // 🌟 DEFINICIÓN SEGURA DE ÍNDICES ÚNICOS:
  // Esto le dice a Sequelize que los trate como únicos sin recrearlos en cada reinicio
  indexes: [
    {
      unique: true,
      fields: ['slug']
    },
    {
      unique: true,
      fields: ['email']
    }
  ]
});

// Hashear password antes de crear/actualizar
Store.beforeCreate(async (store) => {
  // OJO: Si tu controlador de registro ya encripta la contraseña con bcrypt, 
  // ten cuidado de no re-encriptarla aquí. Si notas que luego el login no te reconoce la clave,
  // es porque se aplicó el hash dos veces.
  store.password_hash = await bcrypt.hash(store.password_hash, 10);
});

Store.beforeUpdate(async (store) => {
  if (store.changed('password_hash')) {
    store.password_hash = await bcrypt.hash(store.password_hash, 10);
  }
});

Store.prototype.validatePassword = async function(plain) {
  return bcrypt.compare(plain, this.password_hash);
};

module.exports = Store;